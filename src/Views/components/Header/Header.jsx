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
} from "antd";
import { auth, db } from "../../../Models/firebase/config";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { MenuContext } from "../../../Controls/SideMenuProvider";
import { doc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Header = () => {
  const [currentUser, setCurrentUser] = useState({});

  const [value, setValue] = useState("");
  const { updateRoleID } = useContext(MenuContext);
  const { updateLoad } = useContext(MenuContext);

  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  const navigate = useNavigate();
  const {
    isAuthenticated,
    user: { uid },
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
  const handleEditorChange = (value) => {
    setValue(value);
  };

  const handleClickChatBox = () => {
    if (isAuthenticated) {
      navigate("/chatbox");
    }
  };

  useEffect(() => {
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
  }, []);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [confirmEditLoading, setConfirmEditLoading] = useState(false);
  const [form] = Form.useForm();
  const formRef = useRef(null);

  const handleCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (!values.title || !values.content) {
        message.error("Please full filled data");
        return; // Ngăn không cho việc xử lý tiếp tục
      }

      // Xử lý tiếp tục khi đã có nội dung trong input
      setConfirmEditLoading(true);
      setTimeout(() => {
        setIsEditModalVisible(false);
        setConfirmEditLoading(false);
        handleReset();
      }, 1000);
    });
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
                <Input placeholder="Enter here" />
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
                  value={value}
                  onChange={handleEditorChange}
                  modules={modules}
                  formats={formats}
                />
              </Form.Item>
            </Form>
          </Modal>
        </div>
        <div className="icon-btn-container">
          <BsCameraVideo className="icon-btn" />
        </div>
        <div className="icon-btn-container">
          <BsChatDots className="icon-btn" onClick={handleClickChatBox} />
        </div>
        <Popover content={content}>
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
        </Popover>
      </div>
    </div>
  );
};

export default Header;
