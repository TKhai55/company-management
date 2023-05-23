import React, { useState } from "react";
import { Button, message, Steps, theme } from "antd";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { useNavigate } from "react-router-dom";
import Header from "../../Header/Header";
import SideMenu from "../../SideMenu/SideMenu";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import Step4 from "./Step4";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../../../Models/firebase/config";
import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthProvider";

const CreateAccount = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [nameColumnIndex, setNameColumnIndex] = useState(null);
  const [roleColumnIndex, setRoleColumnIndex] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [tableAccount, setTableAccount] = useState([]);
  const { email, password } = useContext(AuthContext);

  const handleTableData = (data) => {
    setTableData(data);
  };

  const addNewUser = async (username, password, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        username,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: role,
        department: null,
      });

      message.success(`Create account for ${username} successfully!`);
      setTableAccount((prevTableAccount) => [
        ...prevTableAccount,
        {
          Username: username,
          Password: password,
        },
      ]);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const steps = [
    {
      title: "Upload employee's information file",
      content: (
        <Step1
          onDataUpload={handleTableData}
          handleIsFileUploaded={setIsFileUploaded}
        />
      ),
    },
    {
      title: "Choose name column",
      content: (
        <Step2 tableData={tableData} onPassNameIndex={setNameColumnIndex} />
      ),
    },
    {
      title: "Choose role column",
      content: (
        <Step3
          tableData={tableData}
          receivedNameIndex={nameColumnIndex}
          onPassRoleIndex={setRoleColumnIndex}
        />
      ),
    },
    {
      title: "Complete",
      content: <Step4 tableAccount={tableAccount} />,
    },
  ];
  const next = async () => {
    if (current === 0 && !isFileUploaded) {
      message.error("Please upload the employee's information file!");
    } else if (current === 1 && nameColumnIndex === null) {
      message.error("Please select the name column!");
    } else if (current === 2 && roleColumnIndex === null) {
      message.error("Please select the role column!");
    } else if (current === 2) {
      setCurrent(current + 1);
      for (const data of tableData) {
        const name = Object.values(data)
          [nameColumnIndex].split(" ")
          .join("")
          .toLowerCase();
        let username = "";
        let password = `${name}`;
        let role = "";

        if (Object.values(data)[roleColumnIndex].includes("Head Department")) {
          username = `hd.${name}@gmail.com`;
          role = Object.values(data)[roleColumnIndex];
        } else if (Object.values(data)[roleColumnIndex].includes("Employee")) {
          username = `ep.${name}@gmail.com`;
          role = Object.values(data)[roleColumnIndex];
        } else if (
          Object.values(data)[roleColumnIndex].includes("Board of Directors")
        ) {
          username = `bd.${name}@gmail.com`;
          role = Object.values(data)[roleColumnIndex];
        }

        await addNewUser(username, password, role);
      }
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      setCurrent(current + 1);
    }
  };

  const handleDoneButton = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(tableAccount);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "Account-List" + fileExtension);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle = {
    overFlow: "hidden",
    lineHeight: "fit-content",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
    padding: 20,
  };

  return (
    <div className="App-container">
      <Header />
      <div className="App-Content-container">
        <SideMenu />
        <div className="App-Content-Main">
          <div style={{ margin: "30px 30px 0px 30px" }}>
            <Steps current={current} items={items} />
            <div style={contentStyle}>{steps[current].content}</div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {current === steps.length - 1 &&
                tableAccount.length === tableData.length && (
                  <Button type="primary" onClick={handleDoneButton}>
                    Export .xlsx file
                  </Button>
                )}
              {current < steps.length - 1 && isFileUploaded && (
                <Button
                  style={{ marginTop: "20px" }}
                  type="primary"
                  onClick={() => next()}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
