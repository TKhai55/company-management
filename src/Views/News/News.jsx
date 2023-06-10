import dateFormat, { masks } from "dateformat";
import { Avatar, Badge, Card, Col, FloatButton, Input, Row, Tag, Typography } from "antd";
import Meta from "antd/es/card/Meta";
import { collection, onSnapshot, or, orderBy, query, where } from "firebase/firestore";
import React, { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { db, storage } from "../../Models/firebase/config";
import { AuthContext } from "../components/Context/AuthProvider";
import Header from "../components/Header/Header";
import SideMenu from "../components/SideMenu/SideMenu";
import "./News.css";
import { ref } from "firebase/storage";
import { FileOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography

const News = () => {

  const { user: { department, uid } } = useContext(AuthContext)
  const [newsForCurrentUser, setNewsForCurrentUser] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    var currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    var startOfDaySeconds = Math.floor(currentDate.getTime() / 1000);
    currentDate.setHours(23, 59, 59, 999);
    var endOfDaySeconds = Math.floor(currentDate.getTime() / 1000);

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
        const timestamp = change.doc._document.createTime.timestamp.seconds
        news = { id: change.doc.id, ...data }
        if (change.type === "removed") {
          setNewsForCurrentUser(prevNews =>
            prevNews.filter(item => item.id !== news.id)
          );
        } else {
          if (timestamp > startOfDaySeconds && timestamp < endOfDaySeconds) {
            news.isNew = true;
          }
          if (news.timestamp) {
            updatedNews.push(news);
          }
        }
      });
      setNewsForCurrentUser((prevNews) => [...updatedNews, ...prevNews]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [uid, department])

  function extractContent(s) {
    var span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  };


  return (
    <div className="App-container">
      <Header />
      <div className="App-Content-container">
        <SideMenu />
        <div className="App-Content-Main">
          <div>
            <Row style={{ marginLeft: 45, marginRight: 45 }}>
              <Col span={12} style={{ marginTop: 45 }}>
                <div style={{
                  marginLeft: -45,
                  paddingLeft: 45,
                  paddingBottom: "1vh",
                  position: "fixed",
                  height: "15vh",
                  width: "100%",
                  top: 0,
                  zIndex: 100,
                  backgroundColor: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end"
                }}>
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
              </Col>
              <Col span={12}></Col>
            </Row>
            <Row gutter={[10, 5]} style={{ marginLeft: 40, marginRight: 40, marginBottom: 30 }}>
              {
                newsForCurrentUser &&
                newsForCurrentUser
                  .filter(
                    (news) =>
                      news.title.toLowerCase().includes(searchText.toLowerCase()) ||
                      news.content.toLowerCase().includes(searchText.toLowerCase())
                  )
                  .map((news, key) => (
                    <Col span={24}>
                      {
                        !news.isNew && news.timestamp ? (
                          <Card
                            key={key}
                            headStyle={{ fontWeight: "bold", backgroundColor: "#C0DBEA", paddingRight: 50 }}
                            style={{
                              marginTop: 16,
                              overflowY: "clip",
                              height: 200,
                              position: "relative"
                            }}
                            hoverable
                            title={news.title}
                            extra={<a href={`/news/${news.id}`}>More</a>}
                            loading={loading}
                            onClick={() => navigate(`/news/${news.id}`)}
                          >
                            <Meta
                              avatar={news.photoOwner ? <Avatar src={news.photoOwner} /> : <Avatar>{news.emailOwner?.charAt(3).toUpperCase()}</Avatar>}
                              title={<div>{news.ownerName ? news.ownerName : news.emailOwner} <Text style={{ fontSize: 13 }} type="secondary">{` - ${dateFormat(news.timestamp.toDate(), "dddd, mmmm dS, yyyy, h:MM TT")}`}</Text></div>}
                              description={extractContent(news.content).slice(0, 260).length === 260 ? `${extractContent(news.content).slice(0, 260)} ...` : `${extractContent(news.content)}`}
                            />
                            {news.file ? <Tag style={{ marginTop: 10 }} icon={<FileOutlined />} color="blue">{ref(storage, news.file).name}</Tag> : ""}
                          </Card>
                        ) : (
                          <Badge.Ribbon text="New" color="red">
                            <Card
                              key={key}
                              headStyle={{ fontWeight: "bold", backgroundColor: "#C0DBEA", paddingRight: 50 }}
                              style={{
                                marginTop: 16,
                                overflowY: "clip",
                                height: 200,
                              }}
                              hoverable
                              title={news.title}
                              extra={<a href={`/news/${news.id}`}>More</a>}
                              loading={loading}
                              onClick={() => navigate(`/news/${news.id}`)}
                            >
                              <Meta
                                avatar={news.photoOwner ? <Avatar src={news.photoOwner} /> : <Avatar>{news.emailOwner?.charAt(3).toUpperCase()}</Avatar>}
                                title={<div>{news.ownerName ? news.ownerName : news.emailOwner} <Text style={{ fontSize: 13 }} type="secondary">{` - ${dateFormat(news.timestamp.toDate(), "dddd, mmmm dS, yyyy, h:MM TT")}`}</Text></div>}
                                description={extractContent(news.content).slice(0, 260).length === 260 ? `${extractContent(news.content).slice(0, 260)} ...` : `${extractContent(news.content)}`}
                              />
                              {news.file ? <Tag style={{ marginTop: 10 }} icon={<FileOutlined />} color="blue">{ref(storage, news.file).name}</Tag> : ""}
                            </Card>
                          </Badge.Ribbon>
                        )
                      }
                    </Col>
                  ))
              }
            </Row>
            <FloatButton.BackTop />
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
