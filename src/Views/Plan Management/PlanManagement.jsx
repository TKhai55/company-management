import React, { useContext, useEffect } from "react";
import {
  Table,
  Card,
  Row,
  Col,
  Input,
  DatePicker,
  Empty,
  Button,
  Space,
  message,
} from "antd";
import Header from "../components/Header/Header";
import SideMenu from "../components/SideMenu/SideMenu";
import { GetPlan, DeletePlanData } from "../../Controls/PlanManagement";
import { AuthContext } from "../components/Context/AuthProvider";
import { useState } from "react";
import moment from "moment";
import DeleteModal from "../components/Modals/ModalDelete";
import { useNavigate } from "react-router-dom";
import "./PlanManagement.css";

const PlanManagement = () => {
  const navigate = useNavigate();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const {
    user: { uid },
  } = useContext(AuthContext);
  const [planList, setPlanList] = useState([]);
  const [deleteId, setDeleteID] = useState("");
  const sortedPlanList = [...planList];
  //useEffect
  const fetchData = async () => {
    const data = await GetPlan(uid);
    setPlanList(data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const convertTimestampToDate = (timestamp) => {
    const date = moment(timestamp.seconds * 1000);
    return date.format("DD/MM/YYYY");
  };
  const handleTitleSearch = (e) => {
    setSearchTitle(e.target.value);
  };
  const handleDateSelection = (date, dateString) => {
    setSelectedDate(date);
  };
  const handleDeleteOk = () => {
    setConfirmDeleteLoading(true);
    setTimeout(async () => {
      await DeletePlanData(deleteId);
      message.success(`Delete successfully!`);
      setIsDeleteModalVisible(false);
      setConfirmDeleteLoading(false);
      fetchData();
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
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
  sortedPlanList.sort(compareByCreateDate);

  return (
    <div className="App-container">
      <Header />
      <div className="App-Content-container">
        <SideMenu />
        <div className="App-Content-Main">
          {sortedPlanList.length > 0 ? (
            <div className="PlanManagement-container">
              <div className="PlanFeatures-container">
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
              <div className="planList-container">
                {sortedPlanList.map((plan) => {
                  // Kiểm tra điều kiện tìm kiếm theo title
                  const isTitleMatched =
                    searchTitle === "" ||
                    plan.title
                      .toLowerCase()
                      .includes(searchTitle.toLowerCase());

                  // Kiểm tra điều kiện tìm kiếm theo thời gian
                  const isDateMatched =
                    !selectedDate ||
                    (selectedDate >= new Date(plan.start.seconds * 1000) &&
                      selectedDate <= new Date(plan.end.seconds * 1000));
                  if (isTitleMatched && isDateMatched) {
                    return (
                      <Card
                        key={plan.id}
                        extra={
                          plan.isConfirm ? (
                            <span
                              style={{
                                fontWeight: "500",
                                color: "#34CE69",
                                marginRight: "1.5vw",
                              }}
                            >
                              Confirm
                            </span>
                          ) : (
                            <Space size="small">
                              <Button
                                type="dashed"
                                onClick={() => {
                                  navigate(`/planmanagement/${plan.id}`);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                type="dashed"
                                danger
                                onClick={() => {
                                  setDeleteID(plan.id);
                                  setIsDeleteModalVisible(true);
                                }}
                              >
                                Delete
                              </Button>
                              <DeleteModal
                                open={isDeleteModalVisible}
                                onOk={handleDeleteOk}
                                confirmLoading={confirmDeleteLoading}
                                onCancel={handleDeleteCancel}
                              />
                            </Space>
                          )
                        }
                        title={plan.title}
                        style={{
                          marginBottom: "5vh",
                          display: "flex",
                          flexDirection: "column",
                          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        }}
                      >
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
                        <Row>
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
                            <h3 style={{ textAlign: "center" }}>
                              Plan Details
                            </h3>
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
                          dataSource={plan.participants.map(
                            (detail, index) => ({
                              ...detail,
                              index: index + 1,
                            })
                          )}
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
                      </Card>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          ) : (
            <div className="Empty-container">
              <Empty />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanManagement;
