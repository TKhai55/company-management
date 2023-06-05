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
  Dropdown,
  Tooltip,
  DatePicker,
} from "antd";
import { AimOutlined, BellOutlined, CopyOutlined, EditOutlined, LogoutOutlined, PlusOutlined, SolutionOutlined, NotificationOutlined, UploadOutlined, } from "@ant-design/icons";
import { auth, db, storage } from "../../../Models/firebase/config";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { MenuContext } from "../../../Controls/SideMenuProvider";
import { collection, doc, getDoc, getDocs, onSnapshot, or, orderBy, query, updateDoc, where } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { uploadToFirestore } from "../../../Controls/NewsController";
import ImgCrop from 'antd-img-crop';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "antd/dist/reset.css"
import TextArea from "antd/es/input/TextArea";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });


const Header = () => {
  const [currentUser, setCurrentUser] = useState({});

  const { updateRoleID } = useContext(MenuContext);
  const { updateLoad } = useContext(MenuContext);
  const [optionsColleague, setOptionsColleague] = useState([])
  let [colleagueGroup, setColleagueGroup] = useState([])
  const [newPost, setNewPost] = useState([])
  const [isModalEditProfileOpen, setIsModalEditProfileOpen] = useState(false);
  const [formEditProfile] = Form.useForm()
  const [titleTooltipUID, setTitleTooltipUID] = useState("Copy User ID")
  const [previewOpenEditAvatar, setPreviewOpenEditAvatar] = useState(false);
  const [previewEditAvatar, setPreviewEditAvatar] = useState('');
  const [previewTitleEditAvatar, setPreviewTitleEditAvatar] = useState('');
  const [departmentName, setDepartmentName] = useState("")
  const [birthdayString, setBirthdayString] = useState("")
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null)
  const {
    user: { uid, email, displayName, role, department, photoURL, phoneNumber, location },
  } = useContext(AuthContext);
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  const navigate = useNavigate();
  const {
    isAuthenticated,
    user: { uid, email, displayName, role, department, photoURL, phoneNumber, location },
  } = useContext(AuthContext);
  const [editableDisplayName, setEditableDisplayName] = useState(displayName)
  const [phoneNumberCurrentUser, setPhoneNumberCurrentUser] = useState(phoneNumber)
  const [currentLocation, setCurrentLocation] = useState(location)

  const showModalEditProfile = () => {
    setIsModalEditProfileOpen(true);
  };
  const handleEditProfileOk = async () => {
    if (selectedAvatarFile === null) {
      const currentUserRef = doc(db, "users", uid);
      await updateDoc(currentUserRef, {
        phoneNumber: phoneNumberCurrentUser,
        birthday: birthdayString,
        location: currentLocation,
        displayName: editableDisplayName
      });
      updateProfile(auth.currentUser, {
        displayName: editableDisplayName,
      })
      setIsModalEditProfileOpen(false);
      message.success("Update profile successfully!")
    } else {
      const avatarRef = ref(storage, `avatar/${uid}`)
      uploadBytes(avatarRef, selectedAvatarFile).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url) => {
          const currentUserRef = doc(db, "users", uid);
          await updateDoc(currentUserRef, {
            photoURL: url,
            phoneNumber: phoneNumberCurrentUser,
            birthday: birthdayString,
            location: currentLocation,
            displayName: editableDisplayName
          });
          updateProfile(auth.currentUser, {
            displayName: editableDisplayName,
            photoURL: url,
          })
          setIsModalEditProfileOpen(false);
          message.success("Update profile successfully!")
        })
      })
    }



  };
  const handleEditProfileCancel = () => {
    setIsModalEditProfileOpen(false);
  };

  const beforeUploadAvatar = (_blank, fileList) => {
    setSelectedAvatarFile(fileList[0])
    return false;
  }

  const items = [
    {
      key: '1',
      label: (
        <Typography.Text strong>
          {currentUser.displayName ? currentUser.displayName : currentUser.email}
        </Typography.Text>
      ),
    },
    {
      key: '2',
      label: (
        <div onClick={showModalEditProfile}>Edit Profile</div>
      ),
      icon: <EditOutlined />,
    },
    {
      key: "3",
      label: (
        <div
          onClick={() => navigate("/myposts")}
        >My Posts</div>
      ),
      icon: <SolutionOutlined />
    },
    {
      key: '4',
      label: (
        <div
          onClick={() => {
            updateRoleID("");
            updateLoad(true);
            auth.signOut();
          }}
        >
          Log out
        </div>
      ),
      icon: <LogoutOutlined />
    },
  ];

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
      return Object.entries(
        xs.reduce(
          (r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r),
          {}
        )
      ).map(([label, options]) => ({ label, options }));
  }

  useEffect(() => {
    const q = query(collection(db, "users"), where("uid", "==", uid))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(change => {
        setCurrentUser(change.doc.data())
      })
    })

    return () => unsubscribe()
  }, [uid])

  useEffect(() => {
    const q = query(collection(db, "posts"),
      or(where('scope', '==', "public"),
        (where('scope', '==', "custom"), (where("customGroup", "array-contains", uid))),
        (where("scope", "==", department)),
        (where("owner", "==", uid))
      ), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedNews = [];
      let news = {}

      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        news = { id: change.doc.id, ...data }
        if (change.type === "modified") {
          news.isNew = true;
        }
        if (news.timestamp) {
          updatedNews.push(news);
        }
      });
      setNewPost((prevNews) => [...updatedNews, ...prevNews]);
    });
    return () => unsubscribe();
  }, [uid, department])

  useEffect(() => {
    async function getDepartmentName() {
      const docRef = doc(db, "Department", department);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setDepartmentName(docSnap.data().name);
      } else {
        message.error("Your role has been deleted!");
      }
    }
    getDepartmentName();

    (async () => {
      const collectionRef = collection(db, "users");
      const snapshots = await getDocs(collectionRef);
      const docs = snapshots.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;

        return data;
      });
      setOptionsColleague(docs);
    })();
  }, []);

  const result = groupBy(optionsColleague, (option) => option.role);
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
        uploadToFirestore(
          title,
          postcontent,
          scope,
          file,
          currentUser.uid,
          email,
          colleagueGroup
        )
          .then(() => {
            setFile(null);
            message.success("Post create!");
            setIsEditModalVisible(false);
            setConfirmEditLoading(false);
            handleReset();
            setColleagueGroup([]);
            setScope("public");
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
    <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
      <Typography.Text strong>
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
    setColleagueGroup((prev) => [...prev, value]);
  };

  const handleDeselect = (value) => {
    const index = colleagueGroup.indexOf(value);
    if (index > -1) {
      colleagueGroup.splice(index, 1);
    }
  };

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const copyUID = () => {
    navigator.clipboard.writeText(uid)
    setTitleTooltipUID("Copied User ID")
  }
  
  useEffect(() => {
    // Create a Firestore query to fetch posts where the current user is included in the scopeUsers array
    const q = query(
      collection(db, "posts"),
      or(
        where("scope", "==", "public"),
        (where("scope", "==", "custom"),
        where("customGroup", "array-contains", uid)),
        where("scope", "==", department)
      )
    );

    // Subscribe to real-time updates for the query
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          const updatedDoc = { id: change.doc.id, ...change.doc.data() };
          setNewPost((prev) => [...prev, updatedDoc]);
          console.log("Updated document:", updatedDoc);
          // Perform any additional logic with the updated document
        }
      });
    });

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const [fileList, setFileList] = useState([{
    uid: '-1',
    name: 'image.png',
    status: 'done',
    url: photoURL,
  }]);

  const handleCancelEditAvatar = () => setPreviewOpenEditAvatar(false);
  const handlePreviewEditAvatar = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewEditAvatar(file.url || file.preview);
    setPreviewOpenEditAvatar(true);
    setPreviewTitleEditAvatar(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const handleChangeEditAvatar = ({ fileList: newFileList, file: newFile }) => {
    setFileList(newFileList)
    setSelectedAvatarFile(newFile)
  };

  const handleBirthdayChange = (_blank, dateString) => {
    setBirthdayString(dateString)
  }

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showLocation, checkError);
    } else {
      message.error("The browser does not support geolocation")
    }
  }

  const checkError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message.error("Please allow access to location")
        break;
      case error.POSITION_UNAVAILABLE:
        message.error("Location Information unavailable")
        break;
      case error.TIMEOUT:
        message.error("The request to get user location timed out")
        break;
      default:
        break
    }
  };

  const showLocation = async (position) => {
    let response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
    );
    let data = await response.json();
    setCurrentLocation(`${data.address.road}, ${data.address.suburb}, ${data.address.city}, ${data.address.country}`)
  };

  return (
    <div className="header-container">
      <Modal
        open={previewOpenEditAvatar} title={previewTitleEditAvatar} footer={null} onCancel={handleCancelEditAvatar}
      >
        <img
          alt="Avatar"
          style={{
            width: '100%',
          }}
          src={previewEditAvatar}
        />
      </Modal>
      <Modal centered title="Edit Profile" open={isModalEditProfileOpen} onOk={handleEditProfileOk} onCancel={handleEditProfileCancel}>
        <Form
          {...layout}
          name="Edit Profile"
          form={formEditProfile}
        >
          <Form.Item wrapperCol={24} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <ImgCrop rotationSlider>
              <Upload
                listType="picture-circle"
                fileList={fileList}
                onPreview={handlePreviewEditAvatar}
                onChange={handleChangeEditAvatar}
                beforeUpload={beforeUploadAvatar}
                maxCount={1}
              >
                {fileList?.length >= 1 ? null : uploadButton}
              </Upload>

            </ImgCrop>
          </Form.Item>
          <Form.Item
            label="User ID"
            name="uid"
          >
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
              <Input defaultValue={uid} disabled />
              <Tooltip title={titleTooltipUID}>
                <Button onClick={copyUID} >{<CopyOutlined />}</Button>
              </Tooltip>
            </div>
          </Form.Item>
          <Form.Item
            label="Display name"
            name="display name"
          >
            <Input defaultValue={currentUser.displayName} onChange={e => setEditableDisplayName(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
          >
            <Input defaultValue={currentUser.email} disabled />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
          >
            <Input defaultValue={role} disabled />
          </Form.Item>
          <Form.Item
            label="Department"
            name="department"
          >
            <Input defaultValue={departmentName} disabled />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
          >
            <PhoneInput

              country={'vn'}
              inputProps={{ value: phoneNumberCurrentUser, style: { width: "100%" } }}
              onChange={(phone) => setPhoneNumberCurrentUser(phone)}
            />
          </Form.Item>
          <Form.Item
            label="Birthday"
            name="birthday"
          >
            <DatePicker defaultValue={currentUser.birthday ? dayjs(currentUser.birthday, 'DD/MM/YYYY') : ""} style={{ width: "100%" }} format={"DD/MM/YYYY"} onChange={handleBirthdayChange} inputReadOnly />
          </Form.Item>
          <Form.Item
            label="Location"
            name="location"
          >
            <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center" }}>
              <TextArea value={currentLocation} autoSize onChange={e => setCurrentLocation(e.target.value)} />
              <Button onClick={handleGetCurrentLocation}>{<AimOutlined />}</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
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
                    <Select
                      mode="multiple"
                      allowClear
                      style={{
                        width: "15vw",
                        overflowX: "visible",
                      }}
                      placeholder="Custom Group"
                      onSelect={handleChange}
                      options={Object(result)}
                      onDeselect={handleDeselect}
                    />
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
        <Badge
          className="icon-btn-notification"
          count={newPost.length}
          size="default"
          overflowCount={9}
          onClick={() => setNewPost([])}
        >
          <Avatar shape="circle" size="default">
            {<BellOutlined style={{ color: "black", fontSize: 18 }} />}
          </Avatar>
        </Badge>
        <Dropdown
          menu={{
            items,
          }}
          placement="bottomRight"
          arrow
        >
          <Avatar
            style={{
              backgroundColor: `${
                currentUser.photoURL ? "" : `#${randomColor}`
              }`,
            }}
            src={currentUser.photoURL}
          >
            {currentUser.photoURL
              ? ""
              : currentUser.email?.charAt(3)?.toUpperCase()}
          </Avatar>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
