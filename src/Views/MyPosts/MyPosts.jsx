import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header/Header";
import SideMenu from "../components/SideMenu/SideMenu";
import { AuthContext } from "../components/Context/AuthProvider";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../Models/firebase/config";
import { FloatButton, Form, Input, List, Modal, Space, message } from "antd";
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import "./MyPosts.css";
import DeleteModal from "../components/Modals/ModalDelete";
import ReactQuill from "react-quill";

export default function MyPosts() {
  const {
    user: { uid },
  } = useContext(AuthContext);
  const [formEditPost] = Form.useForm();
  const [myPosts, setMyPosts] = useState([]);
  const [onDeleteModalOpen, setOnDeleteModalOpen] = useState(false);
  const [onEditPostModalOpen, setOnEditPostModalOpen] = useState(false);
  const [titlePost, setTitlePost] = useState("");
  const [contentPost, setContentPost] = useState("");
  const [searchText, setSearchText] = useState("");
  const [idDeletedItem, setIdDeletedItem] = useState("");
  const [editedItem, setEditedItem] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("owner", "==", uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedNews = [];
      let news = {};

      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        news = { id: change.doc.id, ...data };
        if (change.type === "modified") {
          news.isNew = true;
        }
        news.timestamp && updatedNews.push(news);
      });
      setMyPosts((prevNews) => [...updatedNews, ...prevNews]);
    });
    return () => unsubscribe();
  }, [uid]);

  const IconText = ({ icon, text, onClick, style }) => (
    <Space style={style} onClick={onClick} className="icontext-button">
      {React.createElement(icon)}
      {text}
    </Space>
  );

  const layout = {
    labelCol: {
      span: 2,
    },
    wrapperCol: {
      span: 22,
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

  function extractContent(s) {
    var span = document.createElement("span");
    span.innerHTML = s;
    return span.textContent || span.innerText;
  }

  function handleEditPost(item) {
    setOnEditPostModalOpen(true);
    setTitlePost(item.title);
    setContentPost(item.content);
    setEditedItem(item.id);
  }

  function handleShowModalDeletePost(item) {
    setIdDeletedItem(item.id);
    setOnDeleteModalOpen(true);
  }

  async function handleDeletePost() {
    await deleteDoc(doc(db, "posts", idDeletedItem));
    setOnDeleteModalOpen(false);
    setMyPosts((prevNews) =>
      prevNews.filter((post) => post.id !== idDeletedItem)
    );
    message.success("Delete post successfully!");
  }

  async function onOKEditPostModal() {
    const postRef = doc(db, "posts", editedItem);
    await updateDoc(postRef, {
      title: titlePost,
      content: contentPost,
    })
      .then(async () => {
        await message.success("Update post successfully!");
        setOnEditPostModalOpen(false);
        window.location.reload();
      })
      .catch((err) => {
        message.error(err.message);
      });
  }

  return (
    <div className="App-container">
      <Header />
      <div className="App-Content-container">
        <SideMenu />
        <div
          className="App-Content-Main"
          style={{
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          <DeleteModal
            open={onDeleteModalOpen}
            onCancel={() => setOnDeleteModalOpen(false)}
            onOk={handleDeletePost}
          />
          <Modal
            centered
            width={"85vw"}
            title="Edit Post"
            open={onEditPostModalOpen}
            onCancel={() => setOnEditPostModalOpen(false)}
            onOk={onOKEditPostModal}
          >
            <Form {...layout} name="Edit Post" form={formEditPost}>
              <Form.Item label="Title">
                <Input
                  value={titlePost}
                  onChange={(e) => setTitlePost(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Content">
                <ReactQuill
                  value={contentPost}
                  onChange={(v) => setContentPost(v)}
                  modules={modules}
                  formats={formats}
                  maxLength={30}
                />
              </Form.Item>
            </Form>
          </Modal>
          <div
            style={{
              marginLeft: -40,
              paddingLeft: 40,
              paddingBottom: "1vh",
              position: "fixed",
              height: "16vh",
              width: "100%",
              top: 0,
              zIndex: 100,
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <Input.Search
              style={{
                width: "50%",
              }}
              placeholder="Enter keywords"
              enterButton
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={(value) => setSearchText(value)}
            />
          </div>
          <List
            style={{
              marginTop: "5vh",
            }}
            itemLayout="vertical"
            size="large"
            dataSource={myPosts.filter(
              (news) =>
                news.title.toLowerCase().includes(searchText.toLowerCase()) ||
                news.content.toLowerCase().includes(searchText.toLowerCase())
            )}
            renderItem={(item) => (
              <List.Item
                key={item.title}
                actions={[
                  <IconText
                    onClick={() => handleEditPost(item)}
                    icon={FormOutlined}
                    text="Edit"
                    style={{
                      color: "#73BBC9",
                      border: "1px solid #73BBC9",
                      padding: 3,
                      borderRadius: 5,
                    }}
                  />,
                  <IconText
                    onClick={() => handleShowModalDeletePost(item)}
                    icon={DeleteOutlined}
                    text="Delete"
                    style={{
                      color: "#E76161",
                      border: "1px solid #E76161",
                      padding: 3,
                      borderRadius: 5,
                    }}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={
                    <a style={{ fontWeight: "bold" }} href={`/news/${item.id}`}>
                      {item.title}
                    </a>
                  }
                />
                {extractContent(item.content).slice(0, 260).length === 260
                  ? `${extractContent(item.content).slice(0, 260)} ...`
                  : `${extractContent(item.content)}`}
              </List.Item>
            )}
          />
          <FloatButton.BackTop />
        </div>
      </div>
    </div>
  );
}
