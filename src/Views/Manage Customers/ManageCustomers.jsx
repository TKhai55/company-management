import React, { useEffect, useRef, useState } from "react";
import "./ManageCustomers.css";
import Header from "../components/Header/Header";
import SideMenu from "../components/SideMenu/SideMenu";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Table,
  message,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../../Models/firebase/config";
import CustomModal from "../components/Modals/Modal";
import {
  AddCustomerData,
  DeleteCustomerData,
  EditCustomerData,
} from "../../Controls/CustomersController";
import DeleteModal from "../components/Modals/ModalDelete";

const ManageCustomers = () => {
  const columns = [
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>
          Customer Name
        </span>
      ),
      dataIndex: "name",
      key: "name",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
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
      title: <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Type</span>,
      dataIndex: "type",
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
            onClick={() => handleEditClick(record)}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>

          <Button
            style={{ backgroundColor: "red", color: "#ffffff" }}
            onClick={() => {
              setrecordID(record.id);
              setIsDeleteModalVisible(true);
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </Space>
      ),
    },
  ];
  const selectOption = [
    {
      type: "Bronze",
      priority: 1,
    },
    {
      type: "Silver",
      priority: 2,
    },
    {
      type: "Gold",
      priority: 3,
    },
    {
      type: "Diamond",
      priority: 4,
    },
  ];

  const { TextArea } = Input;
  const colRef = collection(db, "customers");
  const [tableItems, setTableItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const [formCr] = Form.useForm();
  const formCrRef = useRef(null);
  const [recordId, setrecordID] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editData, setEditData] = useState({});

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formCreateValues, setFormCreateValues] = useState({
    name: null,
    email: null,
    diachi: null,
    sdt: null,
    type: null,
    priority: null,
  });

  const filteredItems = tableItems.filter(
    (item) =>
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.type.toLowerCase().includes(searchText.toLowerCase())
  );
  const handleEditClick = (record) => {
    setrecordID(record.id);
    setEditData(record); // Lưu giữ dữ liệu cần chỉnh sửa vào biến editData
    setFormCreateValues(record);
    setIsEditModalVisible(true);
  };
  const handleSelectChange = (field, value) => {
    setFormCreateValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };
  const fetchData = async () => {
    const querySnapshot = await getDocs(colRef);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  };

  const getData = async () => {
    const data = await fetchData();
    setTableItems(data);
  };

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        name: editData.name,
        email: editData.email,
        sdt: editData.sdt,
        diachi: editData.diachi,
        type: { label: editData.type, value: editData.priority },
      });
    }
  }, [editData]);
  const handleCreateCancel = () => {
    formCrRef.current.resetFields();
    setIsCreateModalVisible(false);
  };

  const handleCreateOk = () => {
    formCr.validateFields().then((values) => {
      if (!values.name || !values.email || !values.type) {
        message.error("Please full filled data");
        return; // Ngăn không cho việc xử lý tiếp tục
      }
      setConfirmLoading(true);
      setTimeout(async () => {
        console.log(formCreateValues);
        const documentId = await AddCustomerData(formCreateValues);
        if (documentId) {
          message.success("Add customer successfully!");
          formCrRef.current.resetFields();
          console.log("Data saved successfully");
          getData();
        }
        setIsCreateModalVisible(false);
        setConfirmLoading(false);
      }, 1000);
    });
  };
  const handleDeleteOk = () => {
    setConfirmLoading(true);
    setTimeout(async () => {
      console.log(recordId);
      await DeleteCustomerData(recordId);
      message.success("Delete successfully!");
      getData();
      setIsDeleteModalVisible(false);
      setConfirmLoading(false);
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };
  const handleEditCancel = () => {
    formRef.current.resetFields();
    setEditData({});
    setIsEditModalVisible(false);
  };

  const handleEditOk = () => {
    form.validateFields().then((values) => {
      if (!values.name || !values.email || !values.type) {
        message.error("Please full filled data");
        return; // Ngăn không cho việc xử lý tiếp tục
      }
      setConfirmLoading(true);
      setTimeout(async () => {
        // console.log(formCreateValues);
        await EditCustomerData(recordId, formCreateValues);
        getData();
        message.success("Edit successfully!");
        formRef.current.resetFields();
        setIsEditModalVisible(false);
        setConfirmLoading(false);
      }, 1000);
    });
  };
  return (
    <div className="App-container">
      <Header />
      <div className="App-Content-container">
        <SideMenu />
        <div className="App-Content-Main">
          <div className="ManageCustomers-container">
            <div className="customer-create">
              <Input.Search
                className="customer-create-search"
                placeholder="Enter keywords"
                enterButton="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={(value) => setSearchText(value)}
              />
              <Button
                id="customer-btn-create"
                onClick={() => {
                  setIsCreateModalVisible(true);
                }}
              >
                Add new customer
              </Button>
              <CustomModal
                title="Add new customer"
                open={isCreateModalVisible}
                onCancel={handleCreateCancel}
                confirmLoading={confirmLoading}
                onOk={handleCreateOk}
              >
                <Form form={formCr} ref={formCrRef}>
                  <Form.Item
                    label="Name"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                    name="name"
                    required
                    tooltip="This is a required field"
                  >
                    <Input
                      placeholder="Name"
                      onChange={(value) =>
                        handleSelectChange("name", value.target.value)
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                    required
                    tooltip="This is a required field"
                  >
                    <Input
                      placeholder="Email"
                      onChange={(value) =>
                        handleSelectChange("email", value.target.value)
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Phone number"
                    name="sdt"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                  >
                    <Input
                      placeholder="Phone number (optional)"
                      onChange={(value) =>
                        handleSelectChange("sdt", value.target.value)
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Address"
                    name="diachi"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                  >
                    <TextArea
                      rows={3}
                      placeholder="Address (optional)"
                      onChange={(value) =>
                        handleSelectChange("diachi", value.target.value)
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Type"
                    name="type"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                    required
                    tooltip="This is a required field"
                  >
                    <Select
                      options={selectOption.map((option) => ({
                        label: option.type,
                        value: option.priority,
                      }))}
                      defaultValue="Choose type"
                      labelInValue
                      onChange={(value) => {
                        console.log("1", value);

                        handleSelectChange("type", value.label);
                        handleSelectChange("priority", value.value);
                      }}
                    />
                  </Form.Item>
                </Form>
              </CustomModal>
            </div>
            <div className="customer-table-container">
              <Table
                className="customer-table"
                dataSource={filteredItems}
                columns={columns}
                pagination={{ pageSize: 5 }}
              />
              <DeleteModal
                open={isDeleteModalVisible}
                onOk={handleDeleteOk}
                confirmLoading={confirmLoading}
                onCancel={handleDeleteCancel}
              />
              <CustomModal
                title="Edit customer"
                open={isEditModalVisible}
                onCancel={handleEditCancel}
                confirmLoading={confirmLoading}
                onOk={handleEditOk}
              >
                <Form
                  form={form}
                  ref={formRef}
                  initialValues={editData} // Truyền dữ liệu từ editData vào các trường input
                >
                  <Form.Item
                    label="Name"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                    name="name"
                    required
                    tooltip="This is a required field"
                  >
                    <Input
                      placeholder="Name"
                      onChange={(value) =>
                        handleSelectChange("name", value.target.value)
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                    required
                    tooltip="This is a required field"
                  >
                    <Input
                      placeholder="Email"
                      onChange={(value) =>
                        handleSelectChange("email", value.target.value)
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Phone number"
                    name="sdt"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                  >
                    <Input
                      placeholder="Phone number (optional)"
                      onChange={(value) =>
                        handleSelectChange("sdt", value.target.value)
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Address"
                    name="diachi"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                  >
                    <TextArea
                      rows={3}
                      placeholder="Address (optional)"
                      onChange={(value) =>
                        handleSelectChange("diachi", value.target.value)
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Type"
                    name="type"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                    required
                    tooltip="This is a required field"
                  >
                    <Select
                      options={selectOption.map((option) => ({
                        label: option.type,
                        value: option.priority,
                      }))}
                      defaultValue="Choose type"
                      labelInValue
                      onChange={(value) => {
                        handleSelectChange("type", value.label);
                        handleSelectChange("priority", value.value);
                      }}
                    />
                  </Form.Item>
                </Form>
              </CustomModal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCustomers;
