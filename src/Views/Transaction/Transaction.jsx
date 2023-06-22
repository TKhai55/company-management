import React, { useContext, useEffect, useState } from "react";
import "./Transaction.css";
import Header from "../components/Header/Header";
import SideMenu from "../components/SideMenu/SideMenu";
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  InputNumber,
  Modal,
  message,
} from "antd";
import { useRef } from "react";
import {
  GetCustomer,
  GetEmployee,
  GetProduct,
  AddTransactionData,
  getDepartmentByEmployee,
} from "../../Controls/TransactionController";

const Transaction = () => {
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const customers = GetCustomer();
  const employee = GetEmployee();
  const [product, setProduct] = useState([]);
  const result = groupBy(employee, (option) => option.role);
  const [selectedProductName, setSelectedProductName] = useState([]);
  const [price, setPrice] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [total, setTotal] = useState(null);
  const { TextArea } = Input;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);


  const [formValue, setFormValue] = useState({
    name: null,
    dongia: 0,
    donvi: null,
    ghichu: null,
    sl: 0,
    khachhang: null,
    khachhangID: null,
    loaiGD: null,
    nguoigiaodichID: null,
    nguoimuaban: null,
    productId: null,
    tongtien: 0,
  });

  const fetchData = async () => {
    const data = await GetProduct();
    setProduct(data);
  };

  useEffect(() => {
    fetchData();
  }, [selectedProductName]);
  result.forEach((res) => {
    res.options = res.options.map((option) => ({
      label: option.displayName,
      value: option.uid,
    }));
  });
  function groupBy(xs, f) {
    if (xs)
      return Object.entries(
        xs.reduce(
          (r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r),
          {}
        )
      ).map(([label, options]) => ({ label, options }));
  }
  useEffect(() => {
    if (price !== null && quantity !== null) {
      const result = price * quantity;
      setTotal(result);
      handleSelectChange("tongtien", result);
    } else {
      setTotal(null);
      handleSelectChange("tongtien", null);
    }
  }, [price, quantity]);

  const handlePriceChange = (value) => {
    setPrice(value);
    handleSelectChange("dongia", value);
  };

  const handleQuantityChange = (value) => {
    setQuantity(value);
    handleSelectChange("sl", value);
  };
  const handleResetContent = () => {
    form.resetFields();
    setSelectedProductName([]);
    setPrice(null);
    setQuantity(null);
    setTotal(null);
  };
  const handleSelectChange = (field, value) => {
    setFormValue((prevValues) => ({
      ...prevValues,
      [field]: value
    }));
  };
  const handleOk = () => {
    getDepartmentByEmployee(formValue.nguoigiaodichID).then(data => formValue.department = data.department)
    form.validateFields().then((values) => {
      if (
        !values.nguoigiaodichID ||
        !values.khachhangID ||
        !values.name ||
        !values.sl ||
        !values.dongia
      ) {
        message.error("Please full filled data");
        return; // Ngăn không cho việc xử lý tiếp tục
      }
      if (formValue.loaiGD === true && formValue.sl > selectedProductName.sl) {
        message.error("Can not export more quantity in stock");
        return;
      }
      setConfirmLoading(true);
      setTimeout(async () => {
        const documentID = await AddTransactionData(formValue);

        if (documentID) message.success("Create transaction successfully!");
        handleResetContent();
        setIsModalVisible(false);
        setConfirmLoading(false);
      }, 1000);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <div className="App-container">
      <Header />
      <div className="App-Content-container">
        <SideMenu />
        <div className="App-Content-Main">
          <div className="Transaction-container">
            <div className="Form-container">
              <Form form={form} ref={formRef}>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Transaction Type"
                      name="loaiGD"
                      required
                      tooltip="This is a required field"
                    >
                      <Select
                        placeholder="Type"
                        style={{ width: "12vw" }}
                        options={[
                          { value: true, label: "Export" },
                          { value: false, label: "Import" },
                        ]}
                        onChange={(value) => {
                          handleSelectChange("loaiGD", value);
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Employee"
                      name="nguoigiaodichID"
                      required
                      tooltip="This is a required field"
                    >
                      <Select
                        placeholder="Employee"
                        style={{ width: "20vw", marginLeft: "3vw" }}
                        options={Object(result)}
                        labelInValue
                        onChange={(value) => {
                          console.log("1", value);

                          handleSelectChange("nguoimuaban", value.label);
                          handleSelectChange("nguoigiaodichID", value.value);
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Customer"
                      name="khachhangID"
                      required
                      tooltip="This is a required field"
                    >
                      <Select
                        placeholder="Customer"
                        style={{ width: "22vw" }}
                        options={customers.map((option) => ({
                          label: option.name,
                          value: option.id,
                        }))}
                        labelInValue
                        onChange={(value) => {
                          handleSelectChange("khachhang", value.label);
                          handleSelectChange("khachhangID", value.value);
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Product Name"
                      name="name"
                      required
                      tooltip="This is a required field"
                    >
                      <Select
                        placeholder="Product Name"
                        style={{ width: "15vw", marginLeft: "0.8vw" }}
                        options={product.map((option) => ({
                          label: option.name,
                          value: option.id,
                        }))}
                        onChange={(option) => {
                          setPrice(null);
                          setQuantity(null);
                          setTotal(null);
                          const selectedProduct = product.find(
                            (item) => item.id === option
                          );
                          setSelectedProductName(selectedProduct);
                          handleSelectChange("name", selectedProduct.name);
                          handleSelectChange("productId", selectedProduct.id);
                          handleSelectChange("donvi", selectedProduct.donvi);
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Unit" name="donvi">
                      {selectedProductName && selectedProductName.donvi}
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label="Current Quantity"
                      name="currentQuantity"
                      style={{
                        color:
                          selectedProductName && selectedProductName.sl > 30
                            ? "green"
                            : "red",
                      }}
                    >
                      {selectedProductName && selectedProductName.sl}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={7}>
                    <Form.Item label="Storage Price" name="CurrentPrice">
                      {selectedProductName &&
                        selectedProductName.giaban &&
                        selectedProductName.giaban.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                      label="Price"
                      name="dongia"
                      required
                      tooltip="This is a required field"
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <InputNumber
                        style={{ width: "18vw", marginLeft: "0.4vw" }}
                        allowClear
                        value={price}
                        formatter={(value) =>
                          value
                            ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                            "đ"
                            : null
                        }
                        parser={(value) => value.replace(/\đ\s?|(,*)/g, "")}
                        onChange={handlePriceChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item
                      label="Quantity"
                      name="sl"
                      required
                      tooltip="This is a required field"
                    >
                      <InputNumber
                        style={{ width: "8.4vw", marginLeft: "0.4vw" }}
                        value={quantity}
                        onChange={handleQuantityChange}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={18}>
                    <Form.Item label="Note" name="note">
                      <TextArea
                        rows={3}
                        style={{ width: "39vw", marginLeft: "0.4vw" }}
                        onChange={(value) => {
                          handleSelectChange("ghichu", value.target.value);
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      label="Total"
                      name="tongtien"
                      style={{ fontWeight: "bold" }}
                    >
                      <h3 style={{ color: "green" }}>
                        {total ? `${total.toLocaleString("vi-VN")} đ` : null}
                      </h3>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
            <div className="Button-container">
              <Button onClick={handleResetContent}>Reset Content</Button>
              <Button
                style={{
                  backgroundColor: "rgb(54, 247, 74)",
                  color: "white",
                  margin: "0 10.5vw 0 1.5vw",
                }}
                onClick={() => {
                  setIsModalVisible(true);
                }}
              >
                Create Transaction
              </Button>
              <Modal
                title="Confirm"
                open={isModalVisible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
              >
                Are you sure to create this transaction ?
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
