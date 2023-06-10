import React, { useContext, useEffect, useRef, useState } from "react";
import Header from "../components/Header/Header";
import SideMenu from "../components/SideMenu/SideMenu";
import "./MakePlan.css";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Empty,
  DatePicker,
  Select,
  Table,
  Space,
  InputNumber,
  Row,
  Col,
  Modal,
  message,
} from "antd";
import { AuthContext } from "../components/Context/AuthProvider";
import { GetDepartmentName } from "../../Controls/ManageDepartment";
import { GetEmployee, AddPlanData } from "../../Controls/MakePlanController";
import { GetProduct } from "../../Controls/TransactionController";

const MakePlan = () => {
  // create variables
  const columns = [
    {
      title: <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>No.</span>,
      dataIndex: "stt",
      render: (text, record, index) => (
        <Form.Item name={`stt[${index}]`}>{index + 1}</Form.Item>
      ),
    },
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Product</span>
      ),
      dataIndex: "product",
      render: (text, record, index) => (
        <Form.Item
          name={`product[${index}]`}
          rules={[{ required: true, message: "Missing product" }]}
        >
          <Select
            placeholder="Product"
            options={product.map((option) => ({
              label: option.name,
              value: option.id,
            }))}
            labelInValue
            onChange={(option) => {
              handlePlanDetailsChange(index, "productID", option.value);
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Type</span>,
      dataIndex: "type",
      render: (text, record, index) => (
        <Form.Item
          name={`type[${index}]`}
          rules={[{ required: true, message: "Missing type" }]}
        >
          <Select
            placeholder="Type"
            // style={{ width: "7vw" }}
            options={[
              { value: true, label: "Export" },
              { value: false, label: "Import" },
            ]}
            labelInValue
            onChange={(option) => {
              handlePlanDetailsChange(index, "type", option.value);
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Profit</span>
      ),
      dataIndex: "profit",
      render: (text, record, index) => (
        <Form.Item
          name={`profit[${index}]`}
          rules={[{ required: true, message: "Missing profit" }]}
        >
          <InputNumber
            min={0}
            decimalSeparator
            placeholder="Profit"
            style={{ width: "100%" }}
            formatter={(value) =>
              value
                ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ"
                : null
            }
            parser={(value) => value.replace(/\đ\s?|(,*)/g, "")}
            onChange={(e) => {
              handlePlanDetailsChange(index, "profit", e);
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Action</span>
      ),
      dataIndex: "",
      render: (text, record, index) =>
        tableData.length > 1 ? (
          <MinusCircleOutlined onClick={() => handleRemoveField(index)} />
        ) : null,
    },
  ];
  const {
    user: { department, uid, role, displayName },
  } = useContext(AuthContext);
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const initialValues = [];
  const [initialRender, setInitialRender] = useState(true);
  const [departmentName, setDepartmentName] = useState("");
  const employee = GetEmployee();
  const result = groupBy(employee, (option) => option.role, uid);

  const [tableData, setTableData] = useState([]);
  const [product, setProduct] = useState([]);
  const [formValue, setFormValue] = useState({
    employeeID: uid,
    department: department,
    role: role,
    name: displayName,
    title: null,
    start: null,
    end: null,
    planDetails: [
      {
        productID: null,
        type: null,
        profit: 0,
      },
    ],
    participants: [],
    isConfirm: false,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // useEffect
  useEffect(() => {
    if (initialRender && tableData.length === 0) {
      setTableData([{}]);
      setInitialRender(false);
    }
  }, [initialRender, tableData]);
  useEffect(() => {
    getName();
    fetchProduct();
  }, []);
  // Other related functions
  const fetchProduct = async () => {
    const data = await GetProduct();
    setProduct(data);
  };
  const getName = async () => {
    const data = await GetDepartmentName(department);
    setDepartmentName(data);
  };

  if (initialValues.length === 0) {
    initialValues.push({ first: "", last: "" }); // Tạo một đối tượng dữ liệu mới với chỉ số index là 0
  }
  result.forEach((res) => {
    res.options = res.options.map((option) => ({
      label: option.displayName,
      value: option.uid,
    }));
  });
  function groupBy(xs, f, uidToExclude) {
    if (xs)
      return Object.entries(
        xs.reduce((r, v) => {
          const k = f(v);
          if (v.uid !== uidToExclude) {
            (r[k] || (r[k] = [])).push(v);
          }
          return r;
        }, {})
      ).map(([label, options]) => ({ label, options }));
  }

  // handle function
  const handleReset = () => {
    form.resetFields();
    setTableData([{}]);
    setFormValue({
      employeeID: uid,
      department: department,
      title: null,
      start: null,
      end: null,
      planDetails: [
        {
          productID: null,
          type: null,
          profit: 0,
        },
      ],
      participants: [],
    });
  };
  const handleOk = () => {
    form.validateFields().then((values) => {
      if (
        !values.title ||
        !values.start ||
        !values.end ||
        !values.participants
      ) {
        message.error("Please full filled data");
        return; // Ngăn không cho việc xử lý tiếp tục
      }
      if (formValue.start.getTime() > formValue.end.getTime()) {
        message.error("Start date can not late than End date");
        return; // Ngăn không cho việc xử lý tiếp tục
      }
      setConfirmLoading(true);
      setTimeout(async () => {
        const documentID = await AddPlanData(formValue);
        if (documentID) message.success("Create plan successfully!");
        handleReset();
        setIsModalVisible(false);
        setConfirmLoading(false);
      }, 1000);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleSelectChange = (field, value) => {
    setFormValue((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };
  const handlePlanDetailsChange = (index, field, value) => {
    setFormValue((prevState) => {
      const newPlanDetails = [...prevState.planDetails];
      newPlanDetails[index][field] = value;
      return {
        ...prevState,
        planDetails: newPlanDetails,
      };
    });
  };

  const handleAddField = () => {
    formValue.planDetails.push({ productID: null, type: null, profit: 0 });
    const newData = [...tableData, { key: tableData.length + 1 }]; // Sử dụng độ dài của mảng tableData để tạo key
    setTableData(newData);
  };

  const handleRemoveField = (index) => {
    const newData = [...tableData];
    newData.splice(index, 1);
    setTableData(newData);

    const newPlanDetails = [...formValue.planDetails];
    newPlanDetails.splice(index, 1);
    setFormValue((prevState) => ({
      ...prevState,
      planDetails: newPlanDetails,
    }));
  };
  const handleDateTimeChange = (field, date) => {
    if (date) {
      const timestamp = date.valueOf(); // Chuyển đổi thành timestamp
      const time = new Date(Number(timestamp));
      setFormValue((prevState) => ({
        ...prevState,
        [field]: time,
      }));
    } else {
      setFormValue((prevState) => ({
        ...prevState,
        [field]: null,
      }));
    }
  };
  const handleChange = (value) => {
    formValue.participants.push(value);
  };

  const handleDeselect = (value) => {
    const index = formValue.participants.indexOf(value);
    formValue.participants.splice(index, 1);
  };
  return (
    <div className="App-container">
      <Header />
      <div className="App-Content-container">
        <SideMenu />
        <div className="App-Content-Main">
          {department ? (
            <div className="MakePlan-container">
              <div className="departmentName-container">
                <h4 style={{ justifySelf: "flex-start" }}>
                  Department: {departmentName.name}
                </h4>
              </div>

              <div className="Form-container">
                <Form ref={formRef} form={form}>
                  <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: "Missing title" }]}
                  >
                    <Input
                      style={{ width: "52%", marginLeft: "2.5vw" }}
                      onChange={(e) => {
                        handleSelectChange("title", e.target.value);
                      }}
                    />
                  </Form.Item>
                  <Row>
                    <Col span={8}>
                      <Form.Item
                        label="Start Date"
                        name="start"
                        rules={[
                          { required: true, message: "Missing start date" },
                        ]}
                      >
                        <DatePicker
                          onChange={(date) => {
                            handleDateTimeChange("start", date);
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        label="End Date"
                        name="end"
                        rules={[
                          { required: true, message: "Missing end date" },
                        ]}
                      >
                        <DatePicker
                          onChange={(date) => {
                            handleDateTimeChange("end", date);
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Table
                    bordered
                    title={() => (
                      <h3 style={{ textAlign: "center" }}>PLAN TABLE</h3>
                    )}
                    dataSource={tableData}
                    columns={columns}
                    pagination={false}
                    // rowKey={(record, index) => index}
                  />
                  <Form.Item
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      type="primary"
                      block
                      icon={<PlusOutlined />}
                      style={{ marginTop: "2vh" }}
                      onClick={() => {
                        handleAddField();
                      }}
                    >
                      Add Field
                    </Button>
                  </Form.Item>
                  <Form.Item
                    label="Participants:"
                    name="participants"
                    rules={[
                      { required: true, message: "Missing participants" },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      allowClear
                      style={{
                        width: "40%",
                        overflowX: "visible",
                      }}
                      placeholder="Custom Group"
                      options={Object(result)}
                      onSelect={handleChange}
                      onDeselect={handleDeselect}
                    />
                  </Form.Item>
                </Form>
              </div>
              <div className="Btn-container">
                <Space>
                  <Button
                    type="dashed"
                    style={{ color: "#FF2222", fontWeight: "400" }}
                    onClick={() => {
                      handleReset();
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    type="primary"
                    style={{ backgroundColor: "#34CE69", fontWeight: "400" }}
                    onClick={() => {
                      setIsModalVisible(true);
                      // console.log(formValue);
                    }}
                  >
                    Create Plan
                  </Button>
                </Space>
                <Modal
                  title="Confirm"
                  open={isModalVisible}
                  onOk={handleOk}
                  confirmLoading={confirmLoading}
                  onCancel={handleCancel}
                >
                  Are you sure to create this plan ?
                </Modal>
              </div>
            </div>
          ) : (
            <div style={{ width: "100%", marginTop: "30vh" }}>
              <Empty />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MakePlan;
