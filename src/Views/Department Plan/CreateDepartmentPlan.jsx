import {
  DatePicker,
  Button,
  Collapse,
  Table,
  Row,
  Col,
  Empty,
  Space,
  Input,
  Form,
  Modal,
  message,
} from "antd";
import React from "react";
import { useEffect } from "react";
import { GetPlanByTime } from "../../Controls/DepartmentPlanController";
import { useState } from "react";
import moment from "moment";
import { useContext } from "react";
import { AuthContext } from "../components/Context/AuthProvider";
import { AddPlanData } from "../../Controls/MakePlanController";
import { useRef } from "react";
import { GetDepartmentName } from "../../Controls/ManageDepartment";

const CreateDepartmentPlan = () => {
  const {
    user: { department, uid, role, displayName, photoURL },
  } = useContext(AuthContext);
  const [planList, setPlanList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const { RangePicker } = DatePicker;
  const { Panel } = Collapse;
  const [mergedDetails, setMergedDetails] = useState([]);
  const [participant, setParticipant] = useState([]);
  const [formValue, setFormValue] = useState({
    employeeID: uid,
    department: department,
    role: role,
    name: displayName,
    photo: photoURL,
    title: null,
    start: null,
    end: null,
    planDetails: [],
    participants: [],
    isConfirm: false,
    isDepartmentPlan: true,
  });
  const [departmentName, setDepartmentName] = useState("");
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const fetchData = async () => {
    const data = await GetPlanByTime();
    setPlanList(data);
  };

  const convertTimestampToDate = (timestamp) => {
    const date = moment(timestamp.seconds * 1000);
    return date.format("DD/MM/YYYY");
  };
  const getName = async () => {
    const data = await GetDepartmentName(department);
    setDepartmentName(data);
  };
  useEffect(() => {
    if (departmentName) {
      setFormValue((prevFormValue) => ({
        ...prevFormValue,
        departmentName: departmentName.name,
      }));
    }
  }, [departmentName]);
  useEffect(() => {
    fetchData();
    getName();
  }, []);

  const filterPlan = () => {
    const data = planList.filter(
      (plan) =>
        plan.start.seconds >= start / 1000 - 86000 &&
        plan.end.seconds <= end / 1000 + 86000
    );
    setFilterList(data);
    mergeDetailsData(data);
    mergeParticipantsData(data);
  };

  const mergeDetailsData = (data) => {
    const updatedDetails = JSON.parse(JSON.stringify(data));
    const mergedDetails = [];
    for (const item of updatedDetails) {
      const details = item.planDetails;
      for (const detail of details) {
        const existingDetailIndex = mergedDetails.findIndex(
          (mergedDetail) =>
            mergedDetail.typeName === detail.typeName &&
            mergedDetail.productName === detail.productName
        );

        if (existingDetailIndex !== -1) {
          // Nếu đã tồn tại detail, cập nhật giá trị profit
          mergedDetails[existingDetailIndex].profit += detail.profit;
        } else {
          // Nếu chưa tồn tại detail, thêm mới vào updatedDetails
          mergedDetails.push(detail);
        }
      }
    }
    handleSelectChange("planDetails", mergedDetails);
    setMergedDetails(mergedDetails); // Cập nhật giá trị mới vào state
  };

  const mergeParticipantsData = (data) => {
    const updatedDetails = JSON.parse(JSON.stringify(data));
    const mergedDetails = [];
    for (const item of updatedDetails) {
      const employee = {
        role: item.role,
        displayName: item.name,
        participantID: item.employeeID,
      };
      mergedDetails.push(employee);

      const details = item.participants;
      for (const detail of details) {
        const existingDetailIndex = mergedDetails.findIndex(
          (mergedDetail) => mergedDetail.participantID === detail.participantID
        );

        if (existingDetailIndex !== -1) {
          // Nếu đã tồn tại detail, cập nhật giá trị profit
          continue;
        } else {
          // Nếu chưa tồn tại detail, thêm mới vào updatedDetails
          mergedDetails.push(detail);
        }
      }
    }
    handleSelectChange("participants", mergedDetails);
    setParticipant(mergedDetails); // Cập nhật giá trị mới vào state
  };

  const handleSelectChange = (field, value) => {
    setFormValue((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };
  const handleReset = () => {
    setFilterList([]);
    setMergedDetails([]);
    setParticipant([]);
  };
  const handleOk = () => {
    form.validateFields().then((values) => {
      if (!values.title) {
        message.error("Please filled title");
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
  const renderPlanItems = () => {
    return filterList.map((plan) => (
      <Panel key={plan.id} header={plan.title} extra={plan.name}>
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
            <h3 style={{ textAlign: "center" }}>Department Plan Details</h3>
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
              Department Participant Details
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
      </Panel>
    ));
  };
  const handleDateTimeChange = (field, date) => {
    if (date) {
      const time = new Date(Number(date));
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
  return (
    <div className="CreateDP-container">
      <div className="btn-merge-container">
        <Space size={"large"}>
          <RangePicker
            allowEmpty={[true, true]}
            onChange={(_, [a, b]) => {
              const start = Date.parse(a);
              const end = Date.parse(b);

              handleDateTimeChange("start", start);
              handleDateTimeChange("end", end);
              setStart(start);
              setEnd(end);
            }}
          />
          <Button
            type="primary"
            onClick={() => {
              filterPlan();
            }}
          >
            Merge Plan
          </Button>
        </Space>
      </div>
      {filterList.length > 0 ? (
        <div>
          <h4>List Plan:</h4>
          <Collapse size="middle" style={{ marginBottom: "5vh" }}>
            {renderPlanItems()}
          </Collapse>
          <Form ref={formRef} form={form} style={{ marginTop: "8vh" }}>
            <Form.Item label="Title" name="title">
              <Input
                style={{ width: "40vw" }}
                onChange={(e) => {
                  handleSelectChange("title", e.target.value);
                }}
              />
            </Form.Item>
          </Form>
        </div>
      ) : null}

      {mergedDetails.length > 0 && participant.length > 0 ? (
        <div
          style={{
            marginBottom: "10vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Table
            bordered
            title={() => (
              <h3 style={{ textAlign: "center" }}>
                Department Participant Details
              </h3>
            )}
            dataSource={mergedDetails.map((detail, index) => ({
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
                Department Participant Details
              </h3>
            )}
            dataSource={participant.map((detail, index) => ({
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
          <Button
            type="primary"
            style={{
              backgroundColor: "#34CE69",
              fontWeight: "400",
              marginTop: "2vh",
              justifySelf: "flex-end",
              alignSelf: "flex-end",
            }}
            onClick={() => {
              setIsModalVisible(true);

              // console.log(formValue);
            }}
          >
            Create Plan
          </Button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            height: "65vh",
            flexDirection: "column",
          }}
        >
          <Empty />
        </div>
      )}

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
  );
};

export default CreateDepartmentPlan;
