import React, { useContext, useEffect, useRef, useState } from "react";
import Header from "../components/Header/Header";
import SideMenu from "../components/SideMenu/SideMenu";
import "./ManageDepartment.css";
import {
  GetUserData,
  AddDepartmentData,
  DeleteDepartmentData,
  EditDepartmentData,
} from "../../Controls/CreateDepartmentController";
import { GetDepartmentName } from "../../Controls/ManageDepartment";
import {
  Table,
  Space,
  Form,
  Button,
  Input,
  message,
  Select,
  Empty,
} from "antd";
import DeleteModal from "../components/Modals/ModalDelete";
import CustomModal from "../components/Modals/Modal";
import { db } from "../../Models/firebase/config";
import { getDocs, collection } from "firebase/firestore";
import { AuthContext } from "../components/Context/AuthProvider";
function ManageDepartment() {
  const columns = [
    {
      title: <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Name</span>,
      dataIndex: "name",
      key: "name",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>
          Leader Mail
        </span>
      ),
      dataIndex: "leadermail",
      key: "leadermail",
      align: "center",
      sorter: (a, b) => a.leadermail.localeCompare(b.key),
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
  const {
    user: { department, uid },
  } = useContext(AuthContext);

  console.log(department);
  const colRef = collection(db, "Department");

  const fetchData = async () => {
    const querySnapshot = await getDocs(colRef);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  };

  const selectUser = GetUserData();
  const selectUserOptions = [
    {
      label: "Tạm trống",
      value: null,
    },
    ...selectUser.map((option) => ({
      label: option.email,
      value: option.id,
    })),
  ];
  const [formCreateValues, setFormCreateValues] = useState({
    leader: undefined,
    leadermail: undefined,
    name: undefined,
  });

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
      item.leadermail.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleEditCancel = () => {
    formRef.current.resetFields();
    setIsEditModalVisible(false);
  };

  const handleEditOk = () => {
    form.validateFields().then((values) => {
      if (!values.leader) {
        message.error("Please full filled data");
        return; // Ngăn không cho việc xử lý tiếp tục
      }
      setConfirmEditLoading(true);
      setTimeout(async () => {
        const formValues = formRef.current.getFieldValue("leader");
        // console.log("1", recordId);
        // console.log("2", formValues.value);
        const documentId = await EditDepartmentData(
          recordId,
          formValues.value,
          formValues.label
        );
        console.log(documentId);
        if (documentId !== false) {
          getData();
          message.success("Edit successfully!");
          formRef.current.resetFields();
        } else {
          formRef.current.resetFields();
          message.error(`Can not assign 2 department for 1 leader`);
        }
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
      if (!values.name || !values.leader) {
        message.error("Please full filled data");
        return; // Ngăn không cho việc xử lý tiếp tục
      }

      // Xử lý tiếp tục khi đã có nội dung trong input
      setConfirmCreateLoading(true);
      setTimeout(async () => {
        const documentId = await AddDepartmentData(formCreateValues);
        if (documentId) {
          message.success(`Create ${formCreateValues.name} successfully!`);
          formRef.current.resetFields();
          console.log("Data saved successfully");
          getData();
        } else {
          formRef.current.resetFields();
          message.error(`Can not assign 2 department for 1 leader`);
        }
        setIsCreateModalVisible(false);
        setConfirmCreateLoading(false);
      }, 1000);
    });
  };

  const handleDeleteOk = () => {
    setConfirmDeleteLoading(true);
    setTimeout(async () => {
      await DeleteDepartmentData(recordId);
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
          {department ? (
            <div className="ManageDepartment-container">
              <h1>{department}</h1>
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
                  title="Create new department"
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
                      <Input
                        placeholder="Department name"
                        onChange={(value) =>
                          handleSelectChange("name", value.target.value)
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      label="Leader"
                      name="leader"
                      labelCol={{ span: 5 }}
                      wrapperCol={{ span: 18 }}
                      required
                      tooltip="This is a required field"
                    >
                      <Select
                        options={selectUserOptions}
                        defaultValue="Chose leader"
                        labelInValue
                        onChange={(value) => {
                          handleSelectChange("leader", value.value);
                          handleSelectChange("leadermail", value.label);
                        }}
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
                      label="Leader"
                      name="leader"
                      labelCol={{ span: 5 }}
                      wrapperCol={{ span: 18 }}
                      required
                      tooltip="This is a required field"
                    >
                      <Select
                        options={selectUserOptions}
                        defaultValue="Chose leader"
                        labelInValue
                      />
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
          ) : (
            <div
              style={{
                height: "60%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Empty />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageDepartment;
