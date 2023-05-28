import React, { useRef, useState, useEffect } from "react";
import "./Header.css";
import logo from "../../../images/main logo.png";
import { BsCameraVideo, BsChatDots } from "react-icons/bs";
import { BiNews } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Popover,
  Form,
  Input,
  Modal,
  Typography,
  message,
  Radio,
  Upload,
  Select,
  Badge,
} from "antd";
import { BellOutlined, NotificationOutlined, UploadOutlined } from "@ant-design/icons";
import { auth, db } from "../../../Models/firebase/config";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { MenuContext } from "../../../Controls/SideMenuProvider";
import { collection, doc, getDoc, getDocs, onSnapshot, or, query, where } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { uploadToFirestore } from "../../../Controls/NewsController";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Header = () => {
  const [currentUser, setCurrentUser] = useState({});

  const [value, setValue] = useState("");
  const { updateRoleID } = useContext(MenuContext);
  const { updateLoad } = useContext(MenuContext);
  const [optionsColleague, setOptionsColleague] = useState([])
  let [colleagueGroup, setColleagueGroup] = useState([])
  const { user: { department } } = useContext(AuthContext)
  const [newPost, setNewPost] = useState([])
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  const navigate = useNavigate();
  const {
    isAuthenticated,
    user: { uid, email },
  } = useContext(AuthContext);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ header: [1, 2, 3, 4, 5, 6] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }], // Chức năng căn chỉnh văn bản
      [{ font: [] }], // Chức năng chọn font chữ
      [{ size: [] }], // Chức năng chọn kích thước chữ
      [{ script: "sub" }, { script: "super" }], // Chức năng chỉnh định dạng chữ dưới, trên
      [{ color: [] }], // Chức năng chọn màu chữ
      ["link", "image", "video"], // Chức năng chèn liên kết, hình ảnh, video
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
      allowImagePaste: true,
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "font",
    "size",
    "script",
    "color",
    "link",
    "image",
    "video",
  ];
  // const handleEditorChange = (value) => {
  //   setValue(value);
  // };

  const handleClickChatBox = () => {
    if (isAuthenticated) {
      navigate("/chatbox");
    }
  };

  function groupBy(xs, f) {
    if (xs)
      return Object.entries(xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {}))
        .map(([label, options]) => ({ label, options }));
  }

  useEffect(() => {
    //Xem xét lại
    async function getDocuments() {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCurrentUser(docSnap.data());
      } else {
        message.error("The user that you log in is not exist in our system!");
      }
    }
    getDocuments();

    ; (async () => {
      const collectionRef = collection(db, "users")
      const snapshots = await getDocs(collectionRef)
      const docs = snapshots.docs.map((doc) => {
        const data = doc.data()
        data.id = doc.id

        return data
      })
      setOptionsColleague(docs)
    })()
  }, []);


  const result = groupBy(optionsColleague, option => option.role)
  result.forEach((res) => {
    res.options = res.options.map((option) => ({
      label: option.displayName || option.email,
      value: option.uid,
    }));
  });

  const [title, setTitle] = useState("");
  const [postcontent, setPostContent] = useState("");
  const [scope, setScope] = useState("public");
  const [file, setFile] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [confirmEditLoading, setConfirmEditLoading] = useState(false);
  const [form] = Form.useForm();
  const formRef = useRef(null);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleEditorChange = (value) => {
    setPostContent(value);
  };

  const handleScopeChange = (e) => {
    setScope(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (!title || !content) {
        message.error("Please fill in all required fields");
        return;
      }

      setConfirmEditLoading(true);

      // Gọi hàm uploadToFirestore để tải lên Firestore
      setTimeout(() => {
        uploadToFirestore(title, postcontent, scope, file, currentUser.uid, email, colleagueGroup)
          .then(() => {
            setFile(null);
            message.success("Post create!");
            setIsEditModalVisible(false);
            setConfirmEditLoading(false);
            handleReset();
            setColleagueGroup([])
            setScope("public")
          })
          .catch((error) => {
            message.error("Error uploading to Firestore");
            console.error(error);
            setConfirmEditLoading(false);
          });
      }, 1000);
    });
  };

  // const handleOk = () => {
  //   form.validateFields().then((values) => {
  //     if (!values.title || !values.content) {
  //       message.error("Please full filled data");
  //       return; // Ngăn không cho việc xử lý tiếp tục
  //     }

  //     // Xử lý tiếp tục khi đã có nội dung trong input
  //     setConfirmEditLoading(true);
  //     setTimeout(() => {
  //       setIsEditModalVisible(false);
  //       setConfirmEditLoading(false);
  //       handleReset();
  //     }, 1000);
  //   });
  // };
  const handleCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleReset = () => {
    formRef.current.resetFields();
  };

  const content = (
    <div>
      <Typography.Text>
        {currentUser.displayName ? currentUser.displayName : currentUser.email}
      </Typography.Text>
      <br />
      <Button
        onClick={() => {
          updateRoleID("");
          updateLoad(true);
          auth.signOut();
        }}
      >
        Log out
      </Button>
    </div>
  );

  const handleChange = (value) => {
    setColleagueGroup(prev => [
      ...prev,
      value
    ])
  };

  const handleDeselect = (value) => {
    const index = colleagueGroup.indexOf(value);
    if (index > -1) {
      colleagueGroup.splice(index, 1);
    }
  }

  useEffect(() => {
    // Create a Firestore query to fetch posts where the current user is included in the scopeUsers array
    const q = query(
      collection(db, "posts"),
      or(where('scope', '==', "public"),
        (where('scope', '==', "custom"), (where("customGroup", "array-contains", uid))),
        (where("scope", "==", department)))
    );

    // Subscribe to real-time updates for the query
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          const updatedDoc = { id: change.doc.id, ...change.doc.data() };
          setNewPost(prev => [
            ...prev,
            updatedDoc
          ])
          console.log("Updated document:", updatedDoc);
          // Perform any additional logic with the updated document
        }
      });
    });

    // Unsubscribe from the real-time updates when the component unmounts
    return () => unsubscribe();
  }, [uid, department]);

  return (
    <div className="header-container">
      <img
        src={logo}
        alt="logo"
        id="logo"
        onClick={() => navigate("/homepage")}
        style={{ cursor: "pointer" }}
      />
      <div className="header-btn-container">
        <div className="icon-btn-container">
          <BiNews
            className="icon-btn"
            onClick={() => {
              setIsEditModalVisible(true);
            }}
          />
          <Modal
            title="Create New Post"
            open={isEditModalVisible}
            onCancel={handleCancel}
            confirmLoading={confirmEditLoading}
            onOk={handleOk}
            width="75vw"
            footer={[
              <Button onClick={handleCancel}>Cancel</Button>,
              <Button
                onClick={handleReset}
                style={{ backgroundColor: "red", color: "white" }}
              >
                Reset Content
              </Button>,
              <Button
                type="primary"
                loading={confirmEditLoading}
                onClick={handleOk}
              >
                Post
              </Button>,
            ]}
          >
            <Form form={form} ref={formRef}>
              <Form.Item
                label="Post title"
                name="title"
                required
                tooltip="This is a required field"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 20 }}
              >
                <Input placeholder="Enter here" onChange={handleTitleChange} />
              </Form.Item>
              <Form.Item
                label="Post content"
                name="content"
                required
                tooltip="This is a required field"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 20 }}
              >
                <ReactQuill
                  value={postcontent}
                  onChange={handleEditorChange}
                  modules={modules}
                  formats={formats}
                />
              </Form.Item>
              <Form.Item
                label="Scope"
                name="scope"
                required
                tooltip="This is a required field"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 24 }}
                initialValue="public"
              >
                <Radio.Group onChange={handleScopeChange}>
                  <Radio value={"public"}>Public</Radio>
                  {currentUser.department && (
                    <Radio value={currentUser.department}>Private</Radio>
                  )}
                  <Radio value="custom">
                    {<Select
                      mode="multiple"
                      allowClear
                      style={{
                        width: '100%',
                        overflowX: "visible"
                      }}
                      placeholder="Custom Group"
                      onSelect={handleChange}
                      options={Object(result)}
                      onDeselect={handleDeselect}
                    />}
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label="File upload"
                name="file"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 20 }}
              >
                <input type="file" onChange={handleFileChange} />
              </Form.Item>
            </Form>
          </Modal>
        </div>
        <div className="icon-btn-container">
          <BsCameraVideo
            className="icon-btn"
            onClick={() => {
              window.open("/video", "_blank");
            }}
          />
        </div>
        <div className="icon-btn-container">
          <BsChatDots className="icon-btn" onClick={handleClickChatBox} />
        </div>
        <Badge className="icon-btn-notification" count={newPost.length} size="default" overflowCount={9} onClick={() => setNewPost([])}>
          <Avatar shape="circle" size="default">{<BellOutlined style={{ color: "black", fontSize: 18 }} />}</Avatar>
        </Badge>
        <Popover content={content}>
          <Avatar
            style={{
              backgroundColor: `${currentUser.photoURL ? "" : `#${randomColor}`
                }`,
            }}
            src={currentUser.photoURL}
          >
            {currentUser.photoURL
              ? ""
              : currentUser.email?.charAt(3)?.toUpperCase()}
          </Avatar>
        </Popover>
      </div>
    </div>
  );
};

export default Header;
