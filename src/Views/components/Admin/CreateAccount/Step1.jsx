import { ArrowRightOutlined, DownCircleOutlined, DownOutlined, EyeInvisibleOutlined, EyeTwoTone, InfoCircleFilled, UserOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Input, Row, Select, Space, Tooltip } from 'antd'
import { collection, getDocs } from 'firebase/firestore';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import * as XLSX from "xlsx";
import { db } from '../../../../Models/firebase/config';

export default function Step1({ onDataUpload, handleIsFileUploaded }) {

  const [data, setData] = useState([]);
  const [roleArray, setRoleArray] = useState([])

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
    // var item = {
    //   label: role.name,
    //   value: key + 1,
    // }
    // items.push(item)
    role.label = role.name
    role.value = role.id
  })


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

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Row>
        <Col span={8}>
          <Input
            placeholder="Enter employee's name"
            prefix={<UserOutlined className="site-form-item-icon" />}
            suffix={
              <Tooltip title="Employee's name does not contain special characters and number.">
                <InfoCircleFilled style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            }
          />
        </Col>

        <Col span={8}>
          <Select
            style={{ width: "90%" }}
            defaultValue="Select role"
            // onChange={handleChange}
            options={roleArray}
          />

          <Button type='primary' style={{ marginTop: "10px", marginBottom: "20px" }}> {<ArrowRightOutlined />} </Button>
        </Col>

        <Col span={8}>
          <Input.Password
            placeholder="Enter employee's password"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Col>
      </Row>
      <div style={{ display: "flex", justifyContent: "space-evenly", flexDirection: "row", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ width: "30%", height: "1px", backgroundColor: "gray" }}></div>
        <p>Or</p>
        <div style={{ width: "30%", height: "1px", backgroundColor: "gray" }}></div>
      </div>
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
    </div>
  )
}

