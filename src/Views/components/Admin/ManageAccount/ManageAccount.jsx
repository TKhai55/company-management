import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import {
  Button,
  Input,
  message,
  Modal,
  Space,
  Switch,
  Table,
  Typography,
} from "antd";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { db } from "../../../../Models/firebase/config";
import Header from "../../Header/Header";
import SideMenu from "../../SideMenu/SideMenu";
import { AuthContext } from "../../Context/AuthProvider";
import { useContext } from "react";

export default function ManageAccount() {
  const [userArray, setUserArray] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [isModalToggleAccountStatusOpen, setIsModalToggleAccountStatusOpen] =
    useState(false);
  const [isModalEnterPasswordOpen, setIsModalEnterPasswordOpen] =
    useState(false);
  const [accountStatus, setStatusAccount] = useState(true);
  const [selectedUID, setSelectedUID] = useState("");
  const [passwordEntered, setPasswordEntered] = useState("");
  const { password } = useContext(AuthContext);

  const showModal = (e) => {
    setIsModalToggleAccountStatusOpen(true);
    setStatusAccount(e);
  };
  const handleOk = async () => {
    return new Promise((resolve, reject) => {
      updateDoc(doc(db, "users", selectedUID), { isActive: accountStatus })
        .then(() => {
          setIsModalToggleAccountStatusOpen(false);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    })
      .then(() => {
        message.success(
          "Update successful, the new account status will be shown after the page is reloaded!"
        );
      })
      .catch((error) => {
        message.error("Oops, an error occurred:", error);
      });
  };
  const handleCancel = () => {
    setIsModalToggleAccountStatusOpen(false);
  };

  const toggle = () => {
    setIsModalEnterPasswordOpen(true);
  };

  const handleEnterPassword = () => {
    if (passwordEntered.length === 0)
      message.error("Please enter your password!");
    else if (passwordEntered.includes(password)) {
      setPasswordEntered("");
      setDisabled(!disabled);
      setIsModalEnterPasswordOpen(false);
    } else if (!passwordEntered.includes(password))
      message.error("Your password is incorrect. \nPlease try again!");
  };

  useEffect(() => {
    (async () => {
      const collectionRef = collection(db, "users");
      const snapshots = await getDocs(collectionRef);
      const docs = snapshots.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;

        return data;
      });
      setUserArray(docs);
    })();
  }, []);

  const filteredItems = userArray.filter(
    (item) =>
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.role.toString().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>UID</span>,
      dataIndex: "uid",
      key: "uid",
      align: "center",
      sorter: (a, b) => a.uid.localeCompare(b.uid),
    },
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Email</span>
      ),
      dataIndex: "email",
      key: "email",
      align: "center",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Role</span>,
      dataIndex: "role",
      key: "role",
      align: "center",
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Status</span>
      ),
      dataIndex: "isActive",
      key: "isActive",
      align: "center",
      render: (text) => (text ? "Active" : "Inactive"),
    },
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Action</span>
      ),
      key: "action",
      align: "center",
      render: (_, record, index) => {
        return (
          <>
            <Space direction="vertical">
              <Switch
                disabled={disabled}
                checked={record.isActive ? true : false}
                onChange={(e) => {
                  showModal(e);
                  setSelectedUID(record.uid);
                }}
                style={{
                  backgroundColor: `${record.isActive ? "green" : "red"}`,
                }}
              />
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <div className="App-container">
      <Header />
      <div className="App-Content-container">
        <SideMenu />
        <div className="App-Content-Main">
          <div
            style={{
              display: "flex",
              marginTop: "7.5vh",
              flexDirection: "column",
              alignItems: "center",
              paddingLeft: "10%",
              paddingRight: "10%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Input.Search
                style={{
                  width: "30%",
                  marginBottom: "3%",
                  justifySelf: "flex-start",
                }}
                placeholder="Enter keywords"
                enterButton="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={(value) => setSearchText(value)}
              />
              <Button
                type="primary"
                onClick={toggle}
                style={{
                  justifySelf: "flex-end",
                }}
              >
                Change status of account
              </Button>
            </div>

            <Modal
              title={`Do you sure to ${
                accountStatus ? "activate" : "deactivate"
              } this account?`}
              open={isModalToggleAccountStatusOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              centered
            >
              {`Once you ${
                accountStatus ? "activate" : "deactivate"
              }, the user ${
                accountStatus ? "can" : "can not"
              } use this email to sign in to the system.`}
            </Modal>

            <Modal
              open={isModalEnterPasswordOpen}
              onCancel={() => {
                setIsModalEnterPasswordOpen(false);
              }}
              onOk={handleEnterPassword}
            >
              <Space
                style={{
                  marginTop: 30,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography.Text>Enter password to continue.</Typography.Text>
                <Input.Password
                  placeholder="input password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  style={{ width: "100%" }}
                  onChange={(e) => setPasswordEntered(e.target.value)}
                  value={passwordEntered}
                />
              </Space>
            </Modal>

            <Table
              columns={columns}
              dataSource={filteredItems}
              style={{
                width: "100%",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                borderRadius: "10px",
              }}
              pagination={{ pageSize: 5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
