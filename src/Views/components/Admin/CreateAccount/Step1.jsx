import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleFilled, UserOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Input, message, Row, Select, Tooltip } from 'antd'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import React from 'react'
import { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import * as XLSX from "xlsx";
import { auth, db } from '../../../../Models/firebase/config';
import { AuthContext } from '../../Context/AuthProvider';

export default function Step1({ onDataUpload, handleIsFileUploaded }) {

  const [data, setData] = useState([]);
  const [roleArray, setRoleArray] = useState([])
  const [keyRole, setKeyRole] = useState("")
  const [employeeName, setEmployeeName] = useState("")
  const [employeePassword, setEmployeePassword] = useState("")
  const { email, password } = useContext(AuthContext);

  useEffect(() => {
    ; (async () => {
      const collectionRef = collection(db, "Role")
      const snapshots = await getDocs(collectionRef)
      const docs = snapshots.docs.map((doc) => {
        const data = doc.data()
        data.id = doc.id

        return data
      })
      setRoleArray(docs)
    })()
  }, [])

  roleArray.map((role) => {
    role.label = role.name
    role.value = role.key
  })

  function containsSpecialChars(str) {
    const specialChars =
      /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  }

  function containsNumbers(str) {
    return /\d/.test(str);
  }

  const handleFileUpLoad = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
      onDataUpload(parsedData)
      handleIsFileUploaded(true)
    };
  };

  const handleClickNext = async () => {
    if (containsSpecialChars(employeeName) || containsNumbers(employeeName)) {
      message.error("Employee's name must not contain special characters or numbers.")
    } else {
      await createUserWithEmailAndPassword(auth, `${keyRole}.${employeeName.split(' ').join('').toLowerCase()}@gmail.com`, employeePassword).then(async userCredential => {
        const user = userCredential.user
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
        await signInWithEmailAndPassword(auth, email, password)
        message.success(`Create account for ${employeeName} successfully!`)
        setEmployeeName("")
        setEmployeePassword("")
        setKeyRole("")
      }).catch(error => {
        message.error(error.message)
      })
    }
  }

  function isEmpty(string) {
    return typeof string === 'string' && string.length === 0;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>

      <Button type='dashed' style={{ height: "fit-content" }}>
        <input
          style={{ cursor: "pointer" }}
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => handleFileUpLoad(e)}
        />
      </Button>

      {data.length > 0 && (
        <table style={{ lineHeight: "100%", color: "black", border: "1px solid black", borderCollapse: "collapse", marginTop: "20px", lineHeight: "30px" }} className="table">
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <>
                  <th style={{ border: "1px solid black" }} key={key}>
                    {key}
                  </th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, index) => (
                  <td style={{ border: "1px solid black" }} key={index}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ display: "flex", justifyContent: "space-evenly", flexDirection: "row", alignItems: "center", marginBottom: "20px", marginTop: "20px" }}>
        <div style={{ width: "30%", height: "1px", backgroundColor: "gray" }}></div>
        <p>Or</p>
        <div style={{ width: "30%", height: "1px", backgroundColor: "gray" }}></div>
      </div>

      <Row>
        <Col span={8}>
          <Input
            placeholder="Enter employee's name"
            prefix={<UserOutlined className="site-form-item-icon" />}
            suffix={
              <Tooltip title="Employee's name does not contain special characters and numbers.">
                <InfoCircleFilled style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            }
            onChange={(e) => setEmployeeName(e.target.value)}
            value={employeeName}
          />
        </Col>

        <Col span={8}>
          <Select
            style={{ width: "90%" }}
            defaultValue="Select role"
            onChange={(key) => setKeyRole(key)}
            options={roleArray}
            value={keyRole ? keyRole : "Select role"}
          />

          {
            !isEmpty(employeeName) && !isEmpty(employeePassword) && !isEmpty(keyRole) && (
              <Button onClick={handleClickNext} type='primary' style={{ marginTop: "30px" }}>Create account</Button>
            )
          }
        </Col>

        <Col span={8}>
          <Input.Password
            placeholder="Enter employee's password"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            onChange={(e) => setEmployeePassword(e.target.value)}
            value={employeePassword}
          />
        </Col>
      </Row>


    </div>
  )
}

