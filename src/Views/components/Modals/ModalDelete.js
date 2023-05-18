import { Modal } from 'antd';

const DeleteModal = ({ open, onCancel, onOk, confirmLoading }) => {
  return (
    <Modal
      title="Delete Item"
      open={open}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      onOk={onOk}
      okType="danger"
    >
      <p>Are you sure you want to delete this item?</p>
    </Modal>
  );
};

export default DeleteModal;