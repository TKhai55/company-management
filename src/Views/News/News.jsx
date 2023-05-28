import dateFormat, { masks } from "dateformat";
import { Avatar, Badge, Card, Col, Input, Row, Tag, Typography } from "antd";
import Meta from "antd/es/card/Meta";
import { collection, getDocs, onSnapshot, or, query, where } from "firebase/firestore";
import React, { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { db, storage } from "../../Models/firebase/config";
import { AuthContext } from "../components/Context/AuthProvider";
import Header from "../components/Header/Header";
import SideMenu from "../components/SideMenu/SideMenu";
import "./News.css";
import { ref } from "firebase/storage";
import { FileFilled, FileOutlined } from "@ant-design/icons";

const { Text } = Typography

const News = () => {

  const { user: { department, uid } } = useContext(AuthContext)
  const [newsForCurrentUser, setNewsForCurrentUser] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "posts"),
      or(where('scope', '==', "public"),
        (where('scope', '==', "custom"), (where("customGroup", "array-contains", uid))),
        (where("scope", "==", department)),
        (where("owner", "==", uid))
      ));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedNews = [];
      let news = {}

      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        // console.log(data.timestamp.toDate().toString())
        news = { id: change.doc.id, ...data }
        if (change.type === "modified") {
          news.isNew = true;
        }
        updatedNews.unshift(news);
      });
      // updatedNews.sort((a, b) => parseFloat(b.timestamp) - parseFloat(a.timestamp));
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
              <Col span={12} style={{ marginTop: 40 }}>
                <Input.Search
                  style={{
                    width: "70%",
                  }}
                  placeholder="Enter keywords"
                  enterButton
                // value={searchText}
                // onChange={(e) => setSearchText(e.target.value)}
                // onSearch={(value) => setSearchText(value)}
                />
              </Col>
              <Col span={12}></Col>
            </Row>
            <Row gutter={[10, 5]} style={{ marginLeft: 40, marginRight: 40, marginBottom: 30 }}>
              {
                newsForCurrentUser && newsForCurrentUser.map(news => (
                  <Col span={24}>
                    {
                      !news.isNew ? (
                        <Card
                          headStyle={{ fontWeight: "bold", backgroundColor: "#C0DBEA", paddingRight: 50 }}
                          style={{
                            marginTop: 16,
                            overflowY: "clip",
                            height: 170,
                          }}
                          hoverable
                          title={news.title}
                          extra={<a href="#">More</a>}
                          loading={loading}
                        >
                          <Meta
                            avatar={<Avatar>{news.emailOwner?.charAt(3).toUpperCase()}</Avatar>}
                            title={<div>{news.emailOwner} - <Text style={{ fontSize: 13 }} type="secondary">{dateFormat(news.timestamp.toDate(), "dddd, mmmm dS, yyyy, h:MM:ss TT")}</Text></div>}
                            description={extractContent(news.content).slice(0, 30).length === 30 ? `${extractContent(news.content).slice(0, 30)} ...` : `${extractContent(news.content)}`}
                          />
                          {news.file ? <Tag style={{ marginTop: 10 }} icon={<FileOutlined />} color="blue">{ref(storage, news.file).name}</Tag> : ""}
                        </Card>
                      ) : (
                        <Badge.Ribbon text="New" color="red">
                          <Card
                            headStyle={{ fontWeight: "bold", backgroundColor: "#C0DBEA", paddingRight: 50 }}
                            style={{
                              marginTop: 16,
                              overflowY: "clip",
                              height: 170,
                            }}
                            hoverable
                            title={news.title}
                            extra={<a href="#">More</a>}
                            loading={loading}
                          >
                            <Meta
                              avatar={<Avatar>{news.emailOwner?.charAt(3).toUpperCase()}</Avatar>}
                              title={<div>{news.emailOwner} - <Text style={{ fontSize: 13 }} type="secondary">{dateFormat(news.timestamp.toDate(), "dddd, mmmm dS, yyyy, h:MM:ss TT")}</Text></div>}
                              description={extractContent(news.content).slice(0, 200).length === 200 ? `${extractContent(news.content).slice(0, 200)} ...` : `${extractContent(news.content)}`}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
