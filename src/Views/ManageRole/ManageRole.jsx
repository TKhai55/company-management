import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header/Header";
import SideMenu from "../components/SideMenu/SideMenu";
import {
  GetFunctionData,
  AddMnRoleData,
  DeleteMnRoleData,
  EditMnRoleData,
} from "../../Controls/ManageRoleController";
import CreateRoleController from "../../Controls/CreateRoleController";
import {
  Table,
  Space,
  Form,
  Button,
  InputNumber,
  Input,
  message,
  Select,
} from "antd";
import DeleteModal from "../components/Modals/ModalDelete";
import CustomModal from "../components/Modals/Modal";
import { db } from "../../Models/firebase/config";
import { getDocs, collection } from "firebase/firestore";
import "./ManageRole.css";
import { MenuProvider } from "../../Controls/SideMenuProvider";

function ManageRole() {
  const columns = [
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Role Name</span>
      ),
      dataIndex: "name",
      key: "name",
      align: "center",
      sorter: (a, b) => a.role.localeCompare(b.name),
    },
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Function</span>
      ),
      dataIndex: "function",
      key: "function",
      align: "center",
      sorter: (a, b) => a.function.localeCompare(b.key),
    },
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>
          Numerical Order
        </span>
      ),
      dataIndex: "stt",
      key: "stt",
      align: "center",
      sorter: (a, b) => a.stt - b.stt,
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

  const colRef = collection(db, "RoleFunction");

  const fetchData = async () => {
    const querySnapshot = await getDocs(colRef);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  };

  const selectRole = CreateRoleController();
  const selectFunction = GetFunctionData();
  const [formCreateValues, setFormCreateValues] = useState({
    role: undefined,
    function: undefined,
    name: undefined,
    stt: undefined,
  });
  const [tableItems, setTableItems] = useState([]);
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
      item.function.toLowerCase().includes(searchText.toLowerCase()) ||
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.stt.toString().includes(searchText)
  );

  const handleEditCancel = () => {
    formRef.current.resetFields();
    setIsEditModalVisible(false);
  };

  const handleEditOk = () => {
    form.validateFields().then((values) => {
      if (!values.stt) {
        message.error("Please full filled data");
        return; // Ngăn không cho việc xử lý tiếp tục
      }
      setConfirmEditLoading(true);
      setTimeout(async () => {
        const formValues = formRef.current.getFieldValue("stt");
        await EditMnRoleData(recordId, formValues);
        getData();
        message.success("Edit successfully!");
        formRef.current.resetFields();
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
      if (!values.role || !values.function || !values.stt) {
        message.error("Please full filled data");
        return; // Ngăn không cho việc xử lý tiếp tục
      }
      setConfirmCreateLoading(true);
      setTimeout(async () => {
        const documentId = await AddMnRoleData(formCreateValues);
        if (documentId) {
          message.success("Assign successfully!");
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
      await DeleteMnRoleData(recordId);
      message.success("Delete successfully!");
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

  const handleSelectChange = (field, value) => {
    setFormCreateValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  return (
    <div className="App-container">
      <Header />
      <div className="App-Content-container">
        <SideMenu />
        <div className="App-Content-Main">
          <div className="ManageRole-container">
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
                onClick={() => {
                  setIsCreateModalVisible(true);
                }}
              >
                Assign Function
              </Button>
              <CustomModal
                title="Assign function for role"
                open={isCreateModalVisible}
                onCancel={handleCreateCancel}
                confirmLoading={confirmCreateLoading}
                onOk={handleCreateOk}
              >
                <Form form={form} ref={formRef}>
                  <Form.Item
                    label="Role"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                    name="role"
                    required
                    tooltip="This is a required field"
                  >
                    <Select
                      options={selectRole.map((option) => ({
                        label: option.name,
                        value: option.id,
                      }))}
                      defaultValue="Choose role"
                      labelInValue
                      onChange={(value) => {
                        handleSelectChange("role", value.value);
                        handleSelectChange("name", value.label);
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Function"
                    name="function"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                    required
                    tooltip="This is a required field"
                  >
                    <Select
                      options={selectFunction.map((option) => ({
                        label: option.label,
                        value: option.label,
                      }))}
                      defaultValue="Choose function"
                      labelInValue
                      onChange={(value) =>
                        handleSelectChange("function", value.label)
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="STT"
                    name="stt"
                    labelCol={{ span: 5 }}
                    required
                    tooltip="This is a required field"
                  >
                    <InputNumber
                      placeholder="STT"
                      type="number"
                      onChange={(value) => handleSelectChange("stt", value)}
                    />
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
                    label="STT"
                    name="stt"
                    labelCol={{ span: 5 }}
                    required
                    tooltip="This is a required field"
                  >
                    <InputNumber placeholder="STT" type="number" />
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

export default ManageRole;
