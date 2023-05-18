import React, { useState } from 'react';

export default function Step2({ tableData, onPassNameIndex }) {
  const [selectedCheckbox, setSelectedCheckbox] = useState(null);

  function handleCheckboxChange(index) {
    setSelectedCheckbox(index === selectedCheckbox ? null : index);
    onPassNameIndex(index === selectedCheckbox ? null : index)
  }

  return (
    <>
      {tableData.length > 0 && (
        <table style={{ lineHeight: '100%', color: 'black', width: '100%', border: "1px solid black", borderCollapse: "collapse", lineHeight: "30px" }} className="table">
          <thead>
            <tr>
              {Object.keys(tableData[0]).map((key, index) => (
                <th style={{ border: "1px solid black" }} key={key}>
                  <input
                    value={index}
                    type="checkbox"
                    checked={selectedCheckbox === index}
                    onChange={(e) => handleCheckboxChange(parseInt(e.target.value))}
                  />
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, index) => (
                  <td style={{ border: "1px solid black" }}  key={index}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
