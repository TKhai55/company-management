import React, { useRef, useState } from 'react'
import "./Header.css"
import logo from '../../../images/main logo.png'
import avatar from '../../../images/avatar.jpg'
import { BsCameraVideo, BsChatDots } from 'react-icons/bs'
import { BiNews } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { Avatar, Button, Popover, Form, Input, Modal, Typography } from 'antd'
import { auth } from '../../../Models/firebase/config'
import { useContext } from 'react'
import { AuthContext } from '../Context/AuthProvider'
import { updateProfile } from 'firebase/auth'


const Header = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  const navigate = useNavigate()
  const { isAuthenticated, user: { displayName, photoURL, email } } = useContext(AuthContext)
  const handleClickChatBox = () => {
    if (isAuthenticated) {
      navigate("/chatbox")
    }

  }

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [confirmEditLoading, setConfirmEditLoading] = useState(false);
  const [form] = Form.useForm();
  const formRef = useRef(null);

  const handleEditCancel = () => { 
    setIsEditModalVisible(false);
  };

  const handleEditOk =  () => {
    setConfirmEditLoading(true);
    setTimeout(()=> {
      setIsEditModalVisible(false);
      setConfirmEditLoading(false);
    }, 1000);
  };

  const content = (
    <div>
      <Typography.Text>{displayName ? displayName : email}</Typography.Text>
      <br />
      <Button onClick={() => auth.signOut()}>Log out</Button>
    </div>
  );
  return (
    <div className='header-container'>
      <img src={logo} alt="logo" id='logo' />
      <div className="header-btn-container">
        <div className='icon-btn-container'>
          <BiNews 
          className="icon-btn" 
          onClick={()=>{
              setIsEditModalVisible(true)
          }}
          />
              <Modal
                title="Edit role"
                open={isEditModalVisible}
                onCancel={handleEditCancel}
                confirmLoading={confirmEditLoading}
                onOk={handleEditOk}
                width='80vw'
                footer={[
                  <Button key="back" onClick={handleEditCancel}>
                    Return
                  </Button>,
                  <Button key="submit" type="primary" loading={confirmEditLoading} onClick={handleEditOk}>
                    Submit
                  </Button>,
                  <Button
                    key="link"
                    href="https://google.com"
                    type="primary"
                    loading={confirmEditLoading}
                    onClick={handleEditOk}
                  >
                    Search on Google
                  </Button>,
                ]}
              >
                <Form form={form} ref={formRef}>
                  <Form.Item 
                    label="STT" 
                    name="stt"
                    labelCol={{ span: 3 }}
                  >
                    <Input 
                    placeholder="STT"/>
                  </Form.Item>
                </Form>
              </Modal>
        </div>
        <div className='icon-btn-container'>
          <BsCameraVideo className="icon-btn" />
        </div>
        <div className='icon-btn-container'>
          <BsChatDots className="icon-btn" onClick={handleClickChatBox} />
        </div>
        <Popover content={content}>
          <Avatar style={{ backgroundColor: `#${randomColor}` }} src={photoURL}>{photoURL ? "" : email?.charAt(3)?.toUpperCase()}</Avatar>
        </Popover>
      </div>

    </div>
  )
}

export default Header
