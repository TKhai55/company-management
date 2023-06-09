import React, { useEffect, useRef, useState } from "react";
import "./ManageStorage.css";
import Header from "../components/Header/Header";
import SideMenu from "../components/SideMenu/SideMenu";
import {
  Button,
  Form,
  Empty,
  Input,
  InputNumber,
  Modal,
  Space,
  Table,
  message,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { db } from "../../Models/firebase/config";
import CustomModal from "../components/Modals/Modal";
import {
  AddStorageData,
  DeleteStorageData,
  EditStorageData,
} from "../../Controls/StorageController";
import DeleteModal from "../components/Modals/ModalDelete";

const ManageStorage = () => {
  const columns = [
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>
          Product Name
        </span>
      ),
      dataIndex: "name",
      key: "name",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Material</span>
      ),
      dataIndex: "chatlieu",
      key: "chatlieu",
      align: "center",
      sorter: (a, b) => a.chatlieu.localeCompare(b.chatlieu),
    },
    {
      title: <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Unit</span>,
      dataIndex: "donvi",
      key: "donvi",
      align: "center",
      sorter: (a, b) => a.donvi.localeCompare(b.donvi),
    },
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Price</span>
      ),
      dataIndex: "giaban",
      key: "giaban",
      align: "center",
      sorter: (a, b) => a.giaban - b.giaban,
      render: (giaban) => (
        <span>
          {giaban.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </span>
      ),
    },
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Quantity</span>
      ),
      dataIndex: "sl",
      key: "sl",
      align: "center",
      sorter: (a, b) => a.sl - b.sl,
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
            style={{ backgroundColor: "#21DACF", color: "#ffffff" }}
            onClick={() => {
              handleClick(record);
            }}
          >
            <FontAwesomeIcon icon={faClockRotateLeft} />
          </Button>
          <Button
            style={{ backgroundColor: "#4ca3f5", color: "#ffffff" }}
            onClick={() => {
              handleEditClick(record);
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>

          <Button
            style={{ backgroundColor: "red", color: "#ffffff" }}
            onClick={() => {
              handleDeleteClick(record);
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </Space>
      ),
    },
  ];

  const columns1 = [
    {
      title: <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Type</span>,
      dataIndex: "type",
      key: "type",
      render: (text, record) => (
        <h4 style={{ color: record.loaiGD ? "green" : "red" }}>
          {record.loaiGD ? "Export" : "Import"}
        </h4>
      ),
    },
    {
      title: <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Date</span>,
      dataIndex: "date",
      key: "date",
      render: (text) => <p>{formatDate(text)}</p>,
    },
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Customer</span>
      ),
      dataIndex: "khachhang",
      key: "khachhang",
      render: (text) => <p>{text}</p>,
    },
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Price</span>
      ),
      dataIndex: "dongia",
      key: "dongia",
      render: (text) => (
        <p>
          {text.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </p>
      ),
    },
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Quantity</span>
      ),
      dataIndex: "sl",
      key: "sl",
      render: (text) => <p>{text}</p>,
    },
    {
      title: <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Unit</span>,
      dataIndex: "donvi",
      key: "donvi",
      render: (text) => <p>{text}</p>,
    },
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Total</span>
      ),
      dataIndex: "tongtien",
      key: "tongtien",
      render: (text) => (
        <p>
          {text.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </p>
      ),
    },
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Employee</span>
      ),
      dataIndex: "nguoimuaban",
      key: "nguoimuaban",
      render: (text) => <p>{text}</p>,
    },
    {
      title: <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Note</span>,
      dataIndex: "ghichu",
      key: "ghichu",
      render: (text) => <p>{text}</p>,
    },
  ];

  const colRef = collection(db, "products");
  const [tableItems, setTableItems] = useState([]);
  const [historyItems, setHistoryItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const [formCr] = Form.useForm();
  const formCrRef = useRef(null);
  const [recordId, setrecordID] = useState("");
  const [productId, setproductId] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editData, setEditData] = useState({});

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formCreateValues, setFormCreateValues] = useState({
    name: null,
    chatlieu: null,
    donvi: null,
    giaban: null,
    sl: 0,
  });

  const filteredItems = tableItems.filter(
    (item) =>
      item.chatlieu.toLowerCase().includes(searchText.toLowerCase()) ||
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.donvi.toLowerCase().includes(searchText.toLowerCase()) ||
      item.sl.toString().includes(searchText) ||
      item.giaban.toString().includes(searchText)
  );

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
  const fetchHistoryData = async (productId) => {
    const colref = collection(db, "transition");
    const q = query(colref, where("productId", "==", productId));
    const data = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    data.sort((a, b) => a.date - b.date);
    return data;
  };

  const getData = async () => {
    const data = await fetchData();
    setTableItems(data);
  };

  const getHistoryData = async (productId) => {
    const data = await fetchHistoryData(productId);
    setHistoryItems(data);
  };

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    getHistoryData(productId);
  }, [productId]);

  const handleCreateCancel = () => {
    formCrRef.current.resetFields();
    setIsCreateModalVisible(false);
  };

  const handleCreateOk = () => {
    formCr.validateFields().then((values) => {
      if (!values.name || !values.donvi || !values.giaban || !values.chatlieu) {
        message.error("Please full filled data");
        return; // Ngăn không cho việc xử lý tiếp tục
      }
      setConfirmLoading(true);
      setTimeout(async () => {
        const documentId = await AddStorageData(formCreateValues);
        if (documentId) {
          message.success("Add successfully!");
          formCrRef.current.resetFields();
          getData();
        }
        setIsCreateModalVisible(false);
        setConfirmLoading(false);
      }, 1000);
    });
  };
  const handleDeleteOk = () => {
    if (editData.sl > 0) {
      message.error("Can not delete product with quantity > 0");
      return;
    }
    setConfirmLoading(true);
    setTimeout(async () => {
      await DeleteStorageData(recordId);
      message.success("Delete successfully!");
      getData();
      setIsDeleteModalVisible(false);
      setConfirmLoading(false);
    }, 1000);
  };

  const handleDeleteCancel = () => {
    console.log(historyItems);
    setIsDeleteModalVisible(false);
  };
  const handleEditCancel = () => {
    formRef.current.resetFields();
    setEditData({});
    setIsEditModalVisible(false);
  };

  const handleEditOk = () => {
    form.validateFields().then((values) => {
      if (!values.price) {
        message.error("Please full filled data");
        return; // Ngăn không cho việc xử lý tiếp tục
      }
      setConfirmLoading(true);
      setTimeout(async () => {
        const formValues = formRef.current.getFieldValue("price");

        await EditStorageData(recordId, formValues);
        getData();
        message.success("Edit successfully!");
        formRef.current.resetFields();
        setIsEditModalVisible(false);
        setConfirmLoading(false);
      }, 1000);
    });
  };
  const handleEditClick = (record) => {
    setrecordID(record.id);
    setIsEditModalVisible(true);
  };
  const handleDeleteClick = (record) => {
    setrecordID(record.id);
    setEditData(record);
    setIsDeleteModalVisible(true);
  };
  const handleClick = (record) => {
    console.log(isDeleteModalVisible);
    if (isEditModalVisible === true || isDeleteModalVisible === true)
      return null;
    else {
      setEditData(record);
      setproductId(record.id);
      setVisible(true);
    }
  };
  const [visible, setVisible] = useState(false);

  const handleCloseModal = () => {
    console.log("2", visible);

    setVisible(false);
  };
  function formatDate(timestamp) {
    const date = new Date(timestamp.seconds * 1000);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return (
    <div className="App-container">
      <Header />
      <div className="App-Content-container">
        <SideMenu />
        <div className="App-Content-Main">
          <div className="ManageStorage-container">
            <div className="storage-create">
              <Input.Search
                className="storage-create-search"
                placeholder="Enter keywords"
                enterButton="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={(value) => setSearchText(value)}
              />
              <Button
                id="storage-btn-create"
                onClick={() => {
                  setIsCreateModalVisible(true);
                }}
              >
                Add new product
              </Button>
              <CustomModal
                title="Add new product"
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
                      placeholder="Product Name"
                      onChange={(value) =>
                        handleSelectChange("name", value.target.value)
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Material"
                    name="chatlieu"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                    required
                    tooltip="This is a required field"
                  >
                    <Input
                      placeholder="Material"
                      onChange={(value) =>
                        handleSelectChange("chatlieu", value.target.value)
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Unit"
                    name="donvi"
                    required
                    tooltip="This is a required field"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                  >
                    <Input
                      placeholder="Unit"
                      onChange={(value) =>
                        handleSelectChange("donvi", value.target.value)
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Price"
                    name="giaban"
                    required
                    tooltip="This is a required field"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                  >
                    <InputNumber
                      style={{ width: "10vw" }}
                      placeholder="Price"
                      onChange={(value) => handleSelectChange("giaban", value)}
                      formatter={(value) =>
                        value
                          ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                            "đ"
                          : null
                      }
                      parser={(value) => value.replace(/\đ\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Form>
              </CustomModal>
            </div>
            <div className="storage-table-container">
              <Table
                className="storage-table"
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
                title="Edit price"
                open={isEditModalVisible}
                onCancel={handleEditCancel}
                confirmLoading={confirmLoading}
                onOk={handleEditOk}
              >
                <Form form={form} ref={formRef}>
                  <Form.Item
                    label="Price"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                    name="price"
                    required
                    tooltip="This is a required field"
                  >
                    <InputNumber
                      style={{ width: "10vw" }}
                      placeholder="Price"
                      formatter={(value) =>
                        value
                          ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                            "đ"
                          : null
                      }
                      parser={(value) => value.replace(/\đ\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Form>
              </CustomModal>
              <Modal
                width={"85%"}
                bodyStyle={{
                  minHeight: "50vh",
                  maxHeight: "65vh",
                  overflowX: "hidden",
                }}
                title={`History transaction of "${editData.name}"`}
                open={visible}
                onCancel={handleCloseModal}
                footer={null}
              >
                <Table
                  bordered
                  dataSource={historyItems}
                  columns={columns1}
                  pagination={false}
                  rowKey={(record, index) => index}
                  locale={{
                    emptyText: (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "40vh",
                        }}
                      >
                        <Empty />
                      </div>
                    ),
                  }}
                />
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageStorage;
