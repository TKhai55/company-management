import React from 'react'
import "./Header.css"
import logo from '../../../images/main logo.png'
import avatar from '../../../images/avatar.jpg'
import {BsCameraVideo, BsChatDots} from 'react-icons/bs'
import {BiNews} from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { Avatar, Button, Popover } from 'antd'
import { auth } from '../../../Models/firebase/config'

const Header = () => {
  const navigate = useNavigate()
  const handleClickChatBox = () => {
    console.log("Chat click")
    navigate("/chatbox")
  }

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
          <BiNews className="icon-btn" />
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
