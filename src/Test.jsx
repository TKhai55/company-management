import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Table,
  Tabs,
  message,
} from "antd";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./Models/firebase/config";
import { useRef, useState } from "react";
import { Header } from "antd/es/layout/layout";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import DeleteModal from "./Views/components/Modals/ModalDelete";
const onFinish = (values) => {
  console.log("Success:", values);
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const App = () => {
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const dataSource = [];
  const [dataArray, setDataArray] = useState();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [deletedItem, setDeletedItem] = useState("");
  const [updateItem, setUpdateItem] = useState({});
  const formRef = useRef(null);
  const formUpdateRef = useRef(null);

  const handleClickSubmit = async () => {
    await addDoc(collection(db, "UserInformation"), {
      username: username,
      address: address,
      password: password,
    })
      .then(() => {
        formRef.current.resetFields();
        message.success("Add new user successfully!");
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const handleClickFetchButton = async () => {
    let user = {};
    const querySnapshot = await getDocs(collection(db, "UserInformation"));
    querySnapshot.forEach((doc) => {
      user = doc.data();
      user.id = doc.id;
      dataSource.push(user);
    });
    setDataArray(dataSource);
  };

  const handleClickDelete = async () => {
    await deleteDoc(doc(db, "UserInformation", deletedItem)).then(() => {
      message.success("Delete User successfully!");
      setOpenDeleteModal(false);
    });
  };

  const handleClickUpdate = async () => {
    const userRef = doc(db, "UserInformation", updateItem.id);

    await updateDoc(userRef, {
      username: username,
      address: address,
      password: password,
    }).then(() => {
      message.success("Update User successfully!");
      setOpenUpdateModal(false);
    });
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 100,
      render: (_, record) => {
        return (
          <div>
            <DeleteOutlined
              onClick={() => {
                setOpenDeleteModal(true);
                setDeletedItem(record.id);
              }}
            />
            <EyeOutlined
              onClick={() => {
                formUpdateRef.current?.setFieldsValue({
                  username: record.username,
                  address: record.address,
                  password: record.password,
                });
                setUpdateItem(record);
                setOpenUpdateModal(true);
              }}
            />
          </div>
        );
      },
    },
  ];

  const items = [
    {
      key: "1",
      label: "Write date",
      children: (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: 30,
            gap: 20,
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: 16,
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(13.5px)",
            border: "1px solid rgba(255, 255, 255, 0.55)",
            width: 700,
            height: 400,
          }}
        >
          <div
            style={{
              fontSize: 30,
            }}
          >
            Register
          </div>
          <Form
            ref={formRef}
            name="basic"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            style={{
              width: 600,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Please input your address!",
                },
              ]}
            >
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 10,
                span: 14,
              }}
            >
              <Button type="primary" onClick={handleClickSubmit}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: "2",
      label: "Read Data",
      children: (
        <div
          style={{
            width: 700,
            height: 400,
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: 16,
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(13.5px)",
            border: "1px solid rgba(255, 255, 255, 0.55)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
          }}
        >
          <Table
            style={{
              width: "80%",
            }}
            // onRow={(record) => {
            //     return {
            //         onClick: () => { handleClickRow(record) }
            //     }
            // }}
            bordered
            pagination={false}
            dataSource={dataArray}
            columns={columns}
            scroll={{
              x: 400,
              y: 200,
            }}
          />
          <Button type="primary" onClick={handleClickFetchButton}>
            Fetch Data
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        flexDirection: "column",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        backgroundImage:
          "url('https://img.freepik.com/free-photo/set-fruits-seeds-leaves_23-2148145087.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Tabs
        tabBarStyle={{
          fontWeight: "bold",
        }}
        items={items}
      />
      <DeleteModal
        open={openDeleteModal}
        onCancel={() => setOpenDeleteModal(false)}
        onOk={handleClickDelete}
      />
      <Modal
        title="Update Information"
        open={openUpdateModal}
        onCancel={() => setOpenUpdateModal(false)}
        onOk={handleClickUpdate}
        footer={[
          <Button key="back" onClick={() => setOpenUpdateModal(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleClickUpdate}>
            Update
          </Button>,
        ]}
      >
        <Form
          name="control-ref"
          ref={formUpdateRef}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 20,
          }}
        >
          <Form.Item label="Username" name="username">
            <Input
              defaultValue={updateItem.username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Address" name="address">
            <Input
              defaultValue={updateItem.address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Password" name="password">
            <Input.Password
              defaultValue={updateItem.password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default App;
