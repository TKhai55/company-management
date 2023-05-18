import React, { useRef, useState } from 'react'
import "./Header.css"
import logo from '../../../images/main logo.png'
import avatar from '../../../images/avatar.jpg'
import {BsCameraVideo, BsChatDots} from 'react-icons/bs'
import {BiNews} from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { Avatar, Button, Popover, Form, Input, Modal } from 'antd'
import { auth } from '../../../Models/firebase/config'


const Header = () => {
  const navigate = useNavigate()
  const handleClickChatBox = () => {
    console.log("Chat click")
    navigate("/chatbox")
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
      <Button onClick={() => auth.signOut()}>Log out</Button>
    </div>
  );
  return (
    <div className='header-container'>
      <img src={logo} alt="logo" id='logo'/>
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
          <BsChatDots className="icon-btn" onClick={handleClickChatBox}/>
        </div>
          <Popover content={content}>
            <Avatar src={avatar} size="large"/>
          </Popover>
      </div>

    </div>
  )
}

export default Header
