import { Modal } from 'antd';

const CustomModal = ({ title, open, onCancel, onOk,confirmLoading, children }) => {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      onOk={onOk}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;