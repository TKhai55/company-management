import React, { useState } from "react";
import { Modal } from "antd";
const Test = () => {
  const historyData = [
    { title: "Mục 1", isMua: true },
    { title: "Mục 2", isMua: false },
    { title: "Mục 3", isMua: true },
    // Thêm các mục lịch sử bán hàng khác vào đây
  ];
  const [visible, setVisible] = useState(false);

  const handleOpenModal = () => {
    setVisible(true);
  };

  const handleCloseModal = () => {
    setVisible(false);
  };
  return (
    <>
      <button onClick={handleOpenModal}>Xem lịch sử bán hàng</button>
      <Modal
        title="Lịch sử bán hàng"
        open={visible}
        onCancel={handleCloseModal}
        footer={null}
      >
        {historyData.map((item, index) => (
          <div key={index} style={{ color: item.isMua ? "green" : "red" }}>
            {item.title}
          </div>
        ))}
      </Modal>
    </>
  );
};

export default Test;
