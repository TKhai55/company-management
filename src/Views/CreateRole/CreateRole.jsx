import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header/Header";
import SideMenu from "../components/SideMenu/SideMenu";
import "./CreateRole.css";
import CreateRoleController, {
  AddRoleData,
  DeleteRoleData,
  EditRoleData,
} from "../../Controls/CreateRoleController";
import { Table, Space, Form, Button, InputNumber, Input, message } from "antd";
import DeleteModal from "../components/Modals/ModalDelete";
import CustomModal from "../components/Modals/Modal";
import { db } from "../../Models/firebase/config";
import { getDocs, collection } from "firebase/firestore";

function CreateRole() {
  const columns = [
    {
      title: <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Name</span>,
      dataIndex: "name",
      key: "name",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Key</span>,
      dataIndex: "key",
      key: "key",
      align: "center",
      sorter: (a, b) => a.key.localeCompare(b.key),
    },
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Priority</span>
      ),
      dataIndex: "priority",
      key: "priority",
      align: "center",
      sorter: (a, b) => a.priority - b.priority,
    },
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Action</span>
      ),
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            style={{ backgroundColor: "#4ca3f5", color: "#ffffff" }}
            onClick={() => {
              setrecordID(record.id);
              setIsEditModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button
            style={{ backgroundColor: "red", color: "#ffffff" }}
            onClick={() => {
              setrecordID(record.id);
              setIsDeleteModalVisible(true);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const colRef = collection(db, "Role");

  const fetchData = async () => {
    const querySnapshot = await getDocs(colRef);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  };

  const [tableItems, setTableItems] = useState([]);
  // let tableItems = []
  const [searchText, setSearchText] = useState("");
  const [recordId, setrecordID] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [confirmCreateLoading, setConfirmCreateLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [confirmEditLoading, setConfirmEditLoading] = useState(false);

  const getData = async () => {
    const data = await fetchData();
    setTableItems(data);
  };

  useEffect(() => {
    getData();
  }, []);

  const filteredItems = tableItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.key.toLowerCase().includes(searchText.toLowerCase()) ||
      item.priority.toString().includes(searchText)
  );

  const handleEditCancel = () => {
    formRef.current.resetFields();
    setIsEditModalVisible(false);
  };

  const handleEditOk = () => {
    form.validateFields().then((values) => {
      if (!values.priority) {
        message.error("Please full filled data");
        return; // Ngăn không cho việc xử lý tiếp tục
      }
      setConfirmEditLoading(true);
      setTimeout(async () => {
        const formValues = formRef.current.getFieldValue("priority");
        await EditRoleData(recordId, formValues);
        message.success(`Edit successfully!`);
        formRef.current.resetFields();
        getData();
        setIsEditModalVisible(false);
        setConfirmEditLoading(false);
      }, 1000);
    });
  };

  const handleCreateCancel = () => {
    formRef.current.resetFields();
    setIsCreateModalVisible(false);
  };

  const handleCreateOk = () => {
    form.validateFields().then((values) => {
      if (!values.name || !values.key || !values.priority) {
        message.error("Please full filled data");
        return; // Ngăn không cho việc xử lý tiếp tục
      }

      // Xử lý tiếp tục khi đã có nội dung trong input
      setConfirmCreateLoading(true);
      setTimeout(async () => {
        const formValues = formRef.current.getFieldsValue();
        console.log(formValues);
        const documentId = await AddRoleData(formValues);
        if (documentId) {
          message.success(`Create ${formValues.name} successfully!`);
          formRef.current.resetFields();
          console.log("Data saved successfully");
          getData();
        }
        setIsCreateModalVisible(false);
        setConfirmCreateLoading(false);
      }, 1000);
    });
  };

  const handleDeleteOk = () => {
    setConfirmDeleteLoading(true);
    setTimeout(async () => {
      if (recordId === "4nyDFcYo2Ulai5BMKc39") {
        message.error("Can not delete Admin role!!!");
        setIsDeleteModalVisible(false);
        setConfirmDeleteLoading(false);
        return;
      }
      await DeleteRoleData(recordId);
      message.success(`Delete successfully!`);
      getData();
      setIsDeleteModalVisible(false);
      setConfirmDeleteLoading(false);
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const [form] = Form.useForm();
  const formRef = useRef(null);

  return (
    <div className="App-container">
      <Header />
      <div className="App-Content-container">
        <SideMenu />
        <div className="App-Content-Main">
          <div className="CreateRole-container">
            <div className="role-create">
              <Input.Search
                className="role-create-search"
                placeholder="Enter keywords"
                enterButton="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={(value) => setSearchText(value)}
              />
              <Button
                id="role-btn-create"
                onClick={() => setIsCreateModalVisible(true)}
              >
                Create Role
              </Button>
              <CustomModal
                title="Create new role"
                open={isCreateModalVisible}
                onCancel={handleCreateCancel}
                confirmLoading={confirmCreateLoading}
                onOk={handleCreateOk}
              >
                <Form form={form} ref={formRef}>
                  <Form.Item
                    label="Name"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                    name="name"
                    required
                    tooltip="This is a required field"
                  >
                    <Input placeholder="Role name" />
                  </Form.Item>
                  <Form.Item
                    label="Key"
                    name="key"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                    required
                    tooltip="This is a required field"
                  >
                    <Input placeholder="Role key" />
                  </Form.Item>
                  <Form.Item
                    label="Priority"
                    name="priority"
                    required
                    tooltip="This is a required field"
                    labelCol={{ span: 5 }}
                  >
                    <InputNumber placeholder="Priority" type="number" />
                  </Form.Item>
                </Form>
              </CustomModal>
              <CustomModal
                title="Edit role"
                open={isEditModalVisible}
                onCancel={handleEditCancel}
                confirmLoading={confirmEditLoading}
                onOk={handleEditOk}
              >
                <Form form={form} ref={formRef}>
                  <Form.Item
                    label="Priority"
                    name="priority"
                    labelCol={{ span: 5 }}
                    required
                    tooltip="This is a required field"
                  >
                    <InputNumber placeholder="Priority" type="number" />
                  </Form.Item>
                </Form>
              </CustomModal>
            </div>
            <div className="role-table-container">
              <Table
                className="role-table"
                dataSource={filteredItems}
                columns={columns}
                pagination={{ pageSize: 5 }}
              />
              <DeleteModal
                open={isDeleteModalVisible}
                onOk={handleDeleteOk}
                confirmLoading={confirmDeleteLoading}
                onCancel={handleDeleteCancel}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateRole;
