import { Button, message } from 'antd'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import React from 'react'
import Lottie from "lottie-react";
import Success from "../../../../images/Success.json"

export default function Step4({tableAccount}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "40px" }}>
        <Lottie animationData={Success} style={{ width: "100px", height: "100px" }}/>
        {
            tableAccount.length > 0 && 
            <table style={{ lineHeight: "100%", color: "black", border: "1px solid black", borderCollapse: "collapse", width: "600px", lineHeight: "30px", textAlign: "left" }} className="table">
          <thead>
            <tr>
              {Object.keys(tableAccount[0]).map((key) => (
                <>
                  <th style={{ border: "1px solid black", textAlign: "center" }} key={key}>
                    {key}
                  </th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableAccount.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, index) => (
                  <td style={{ border: "1px solid black", paddingLeft: "20px" }} key={index}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>   
        }
    </div>
  )
}
