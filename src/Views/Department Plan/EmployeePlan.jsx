import React, { useEffect, useState } from "react";
import {
  EditDepartmentData,
  GetDepartmentPlan,
} from "../../Controls/DepartmentPlanController";
import { useContext } from "react";
import { AuthContext } from "../components/Context/AuthProvider";
import {
  Avatar,
  Card,
  Empty,
  Switch,
  Space,
  Button,
  Modal,
  Row,
  Col,
  Table,
  message,
  Select,
  Input,
  DatePicker,
} from "antd";
import moment from "moment";

const EmployeePlan = () => {
  const {
    user: { department },
  } = useContext(AuthContext);
  const [eidtId, setEditID] = useState("");
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [planList, setPlanList] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const filteredPlanList = showAllPlans
    ? planList.filter((plan) => plan.isConfirm)
    : planList.filter((plan) => !plan.isConfirm);
  const fetchData = async () => {
    const data = await GetDepartmentPlan(department);
    setPlanList(data);
    setIsModalVisible(new Array(data.length).fill(false));
  };
  useEffect(() => {
    fetchData();
  }, []);
  const convertTimestampToDate = (timestamp) => {
    const date = moment(timestamp.seconds * 1000);
    return date.format("DD/MM/YYYY");
  };
  const compareByCreateDate = (a, b) => {
    const dateA = new Date(a.createDate.seconds * 1000);
    const dateB = new Date(b.createDate.seconds * 1000);

    if (dateA < dateB) {
      return 1; // Trả về -1 nếu createDate của a nhỏ hơn createDate của b
    } else if (dateA > dateB) {
      return -1; // Trả về 1 nếu createDate của a lớn hơn createDate của b
    } else {
      return 0; // Trả về 0 nếu createDate của a bằng createDate của b
    }
  };
  filteredPlanList.sort(compareByCreateDate);
  const handleOk = (index) => {
    setConfirmLoading(true);
    setTimeout(async () => {
      const document = await EditDepartmentData(eidtId, isConfirm);
      // console.log(document);
      if (document != null) {
        message.success(`Edit successfully!`);
        setIsModalVisible((prev) => {
          const newIsModalVisible = [...prev];
          newIsModalVisible[index] = false;
          return newIsModalVisible;
        });
        setConfirmLoading(false);
        fetchData();
      } else {
        message.success(`Edit fail!`);

        setConfirmLoading(false);
      }
    }, 1000);
  };

  const handleCancel = (index) => {
    setIsModalVisible((prev) => {
      const newIsModalVisible = [...prev];
      newIsModalVisible[index] = false;
      return newIsModalVisible;
    });
  };
  const handleTitleSearch = (e) => {
    setSearchTitle(e.target.value);
  };
  const handleDateSelection = (date, dateString) => {
    setSelectedDate(date);
  };
  return (
    <div className="EmployeePlan-container">
      <Select
        defaultValue={false}
        options={[
          { value: false, label: "Unconfirmed" },
          { value: true, label: "Confirmed" },
        ]}
        onChange={(option) => {
          setShowAllPlans(option);
        }}
        style={{ marginBottom: "2vh", alignSelf: "flex-end", width: "12%" }}
      />

      {filteredPlanList.length > 0 ? (
        <div className="Card-container">
          <div className="Features-container">
            <Row>
              <Col span={18}>
                <Input.Search
                  placeholder="Search by title"
                  value={searchTitle}
                  onChange={handleTitleSearch}
                  style={{ width: "25vw" }}
                  enterButton="Search"
                />
              </Col>
              <Col>
                <DatePicker
                  onChange={handleDateSelection}
                  style={{ width: "15.8vw" }}
                  placeholder="Search by date"
                />
              </Col>
            </Row>
          </div>
          <div className="CardList-container">
            {filteredPlanList.map((plan, index) => {
              // Kiểm tra điều kiện tìm kiếm theo title
              const isTitleMatched =
                searchTitle === "" ||
                plan.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
                plan.name.toLowerCase().includes(searchTitle.toLowerCase());
              // Kiểm tra điều kiện tìm kiếm theo thời gian
              const isDateMatched =
                !selectedDate ||
                (selectedDate >= new Date(plan.start.seconds * 1000) &&
                  selectedDate <= new Date(plan.end.seconds * 1000));
              if (isTitleMatched && isDateMatched) {
                return (
                  <Card
                    key={plan.id}
                    title={plan.title}
                    headStyle={{
                      fontWeight: "500",
                      backgroundColor: "#ABFFFA",
                    }}
                    extra={
                      <Button
                        type="link"
                        onClick={() => {
                          setEditID(plan.id);
                          setIsModalVisible((prev) => {
                            const newIsModalVisible = [...prev];
                            newIsModalVisible[index] = true;
                            return newIsModalVisible;
                          });
                          setIsConfirm(plan.isConfirm);
                        }}
                      >
                        More
                      </Button>
                    }
                    style={{
                      boxShadow:
                        "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
                    }}
                  >
                    <Modal
                      key={plan.id}
                      title="Plan Detail"
                      width={1100}
                      visible={isModalVisible[index]}
                      onOk={() => handleOk(index)}
                      confirmLoading={confirmLoading}
                      onCancel={() => handleCancel(index)}
                      style={{ top: 25 }}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Switch
                          checked={isConfirm}
                          checkedChildren="Confirmed"
                          unCheckedChildren="Unconfirmed"
                          onChange={(checked) => {
                            setIsConfirm(checked);
                          }}
                          style={{
                            alignSelf: "flex-end",
                            width: "11%",
                          }}
                        />
                      </div>

                      <Row style={{ padding: "1vh 0 1.5vh 0" }}>
                        <Col span={3}>Employee name: </Col>
                        <Col span={8}>
                          <h4>{plan.name}</h4>
                        </Col>
                      </Row>
                      <Row style={{ padding: "1vh 0 1.5vh 0" }}>
                        <Col span={3}>Department: </Col>
                        <Col span={8}>
                          <h4>{plan.departmentName}</h4>
                        </Col>
                        <Col span={3}>Create date:</Col>
                        <Col span={8}>
                          <h4>{convertTimestampToDate(plan.createDate)}</h4>
                        </Col>
                      </Row>
                      <Row style={{ padding: "1vh 0 1.5vh 0" }}>
                        <Col span={3}>Start date:</Col>
                        <Col span={8}>
                          <h4>{convertTimestampToDate(plan.start)}</h4>
                        </Col>
                        <Col span={3}>End date:</Col>
                        <Col span={8}>
                          <h4>{convertTimestampToDate(plan.end)}</h4>
                        </Col>
                      </Row>

                      <Table
                        bordered
                        title={() => (
                          <h3 style={{ textAlign: "center" }}>Plan Details</h3>
                        )}
                        dataSource={plan.planDetails.map((detail, index) => ({
                          ...detail,
                          index: index + 1,
                        }))}
                        columns={[
                          {
                            title: (
                              <span
                                style={{
                                  color: "#4ca3f5",
                                  fontWeight: "bold",
                                }}
                              >
                                No.
                              </span>
                            ),
                            dataIndex: "index",
                            key: "index",
                            render: (text) => <span>{text}</span>,
                          },
                          {
                            title: (
                              <span
                                style={{
                                  color: "#4ca3f5",
                                  fontWeight: "bold",
                                }}
                              >
                                Product
                              </span>
                            ),
                            dataIndex: "productName",
                            key: "productName",
                          },
                          {
                            title: (
                              <span
                                style={{
                                  color: "#4ca3f5",
                                  fontWeight: "bold",
                                }}
                              >
                                Type
                              </span>
                            ),
                            dataIndex: "typeName",
                            key: "typeName",
                            render: (text, record) => (
                              <span
                                style={{
                                  color: record.typeID ? "green" : "red",
                                }}
                              >
                                {text}
                              </span>
                            ),
                          },
                          {
                            title: (
                              <span
                                style={{
                                  color: "#4ca3f5",
                                  fontWeight: "bold",
                                }}
                              >
                                Profit
                              </span>
                            ),
                            dataIndex: "profit",
                            key: "profit",
                            render: (giaban) => (
                              <span>
                                {giaban.toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })}
                              </span>
                            ),
                          },
                        ]}
                        style={{ marginTop: "5vh" }}
                        pagination={{ pageSize: 5 }}
                      />
                      <Table
                        bordered
                        title={() => (
                          <h3 style={{ textAlign: "center" }}>
                            Participant Details
                          </h3>
                        )}
                        dataSource={plan.participants.map((detail, index) => ({
                          ...detail,
                          index: index + 1,
                        }))}
                        columns={[
                          {
                            title: (
                              <span
                                style={{
                                  color: "#4ca3f5",
                                  fontWeight: "bold",
                                }}
                              >
                                No.
                              </span>
                            ),
                            dataIndex: "index",
                            key: "index",
                            render: (text) => <span>{text}</span>,
                          },
                          {
                            title: (
                              <span
                                style={{
                                  color: "#4ca3f5",
                                  fontWeight: "bold",
                                }}
                              >
                                Name
                              </span>
                            ),
                            dataIndex: "displayName",
                            key: "displayName",
                          },
                          {
                            title: (
                              <span
                                style={{
                                  color: "#4ca3f5",
                                  fontWeight: "bold",
                                }}
                              >
                                Role
                              </span>
                            ),
                            dataIndex: "role",
                            key: "role",
                          },
                        ]}
                        style={{ marginTop: "5vh" }}
                        pagination={{ pageSize: 5 }}
                      />
                    </Modal>
                    <Space size="large">
                      {plan.photo ? (
                        <Avatar src={plan.photo} />
                      ) : (
                        <Avatar
                          style={{
                            backgroundColor: "#00a2ae",
                            verticalAlign: "middle",
                          }}
                          size="large"
                        >
                          {plan.name.substring(0, 1)}
                        </Avatar>
                      )}
                      <div>
                        <h3 style={{ marginBottom: 0 }}>{plan.name}</h3>
                        <p
                          style={{
                            color: "GrayText",
                            fontSize: "12px",
                            marginBottom: 0,
                          }}
                        >
                          Created date:{" "}
                          {convertTimestampToDate(plan.createDate)}
                        </p>
                      </div>
                    </Space>
                  </Card>
                );
              }

              return null;
            })}
          </div>
        </div>
      ) : (
        <div key="empty" className="empty-container">
          <Empty />
        </div>
      )}
    </div>
  );
};

export default EmployeePlan;
