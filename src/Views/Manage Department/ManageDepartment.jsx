import React, { useContext, useEffect, useRef, useState } from "react";
import Header from "../components/Header/Header";
import SideMenu from "../components/SideMenu/SideMenu";
import "./ManageDepartment.css";
import {
  GetDepartmentName,
  GetUserData,
  AddDepartmentData,
} from "../../Controls/ManageDepartment";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import DeleteModal from "../components/Modals/ModalDelete";
import CustomModal from "../components/Modals/Modal";
import { db } from "../../Models/firebase/config";
import { getDocs, collection, query, where } from "firebase/firestore";
import { AuthContext } from "../components/Context/AuthProvider";
function ManageDepartment() {
  const columns = [
    {
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>
          Employee Name
        </span>
      ),
      dataIndex: "displayName",
      key: "displayName",
      align: "center",
      sorter: (a, b) => a.displayName.localeCompare(b.displayName),
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
      title: (
        <span style={{ color: "#4ca3f5", fontWeight: "bold" }}>Action</span>
      ),
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
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
  const {
    user: { department, uid },
  } = useContext(AuthContext);

  const [departmentName, setdepartmentName] = useState("");
  const colRef = collection(db, "users");

  const getName = async () => {
    const data = await GetDepartmentName(department);
    setdepartmentName(data);
  };
  const fetchData = async (department) => {
    const q = query(
      colRef,
      where("department", "==", department),
      where("role", "==", "Employee")
    );
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  };
  const fetchSelectData = async () => {
    const q = query(
      colRef,
      where("department", "==", null),
      where("role", "==", "Employee")
    );
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  };

  const [selectUser, setselectUser] = useState([]);
  const selectUserOptions = [
    ...selectUser.map((option) => ({
      label: option.displayName,
      value: option.id,
    })),
  ];
  const [employeeID, setEmployeeID] = useState("");

  const [tableItems, setTableItems] = useState([]);
  // let tableItems = []
  const [searchText, setSearchText] = useState("");
  const [recordId, setrecordID] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [confirmCreateLoading, setConfirmCreateLoading] = useState(false);

  const getData = async () => {
    const data = await fetchData(department);
    setTableItems(data);
  };
  const getSelectData = async () => {
    const data = await fetchSelectData();
    setselectUser(data);
  };
  useEffect(() => {
    getName();
  }, []);
  useEffect(() => {
    getSelectData();
    getData();
  }, []);

  const filteredItems = tableItems.filter(
    (item) =>
      item.displayName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCreateCancel = () => {
    formRef.current.resetFields();
    setIsCreateModalVisible(false);
  };

  const handleCreateOk = () => {
    form.validateFields().then((values) => {
      if (!values.employee) {
        message.error("Please fill in all the required fields");
        return;
      }

      setConfirmCreateLoading(true);
      AddDepartmentData(employeeID, department)
        .then((result) => {
          if (result) {
            getSelectData();

            getData();
            return null;
          } else {
            message.error("Can not assign 2 departments to 1 leader");
          }
        })
        .then(() => {
          message.success("Add employee successfully!");
          formRef.current.resetFields();
          setIsCreateModalVisible(false);
          setConfirmCreateLoading(false);
        })
        .catch((error) => {
          console.error("Error adding department data: ", error);
          setConfirmCreateLoading(false);
        });
    });
  };

  const handleDeleteOk = () => {
    setConfirmDeleteLoading(true);
    setTimeout(async () => {
      await AddDepartmentData(recordId, null);
      message.success("Delete successfully!");
      getData();
      getSelectData();
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
          {department ? (
            <div className="ManageDepartment-container">
              <h3 style={{ marginLeft: "8vw", marginBottom: "3vh" }}>
                Department: {departmentName.name}
              </h3>
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
                  Add new employee
                </Button>
                <CustomModal
                  title="Add new employee"
                  open={isCreateModalVisible}
                  onCancel={handleCreateCancel}
                  confirmLoading={confirmCreateLoading}
                  onOk={handleCreateOk}
                >
                  <Form form={form} ref={formRef}>
                    <Form.Item
                      label="Employee"
                      name="employee"
                      required
                      tooltip="This is a required field"
                    >
                      <Select
                        options={selectUserOptions}
                        defaultValue="Choose employee"
                        labelInValue
                        onChange={(value) => {
                          setEmployeeID(value.value);
                        }}
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
