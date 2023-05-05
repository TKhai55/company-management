import React from 'react'
import "./Header.css"
import logo from '../../../images/main logo.png'
import avatar from '../../../images/avatar.jpg'
import {BsCameraVideo, BsChatDots} from 'react-icons/bs'
import {BiNews} from 'react-icons/bi'

const Header = () => {
  return (
    <div className='header-container'>
      <img src={logo} alt="logo" id='logo'/>
      <div className="header-btn-container">
            <BiNews className="icon-btn" />
            <BsCameraVideo className="icon-btn" />
            <BsChatDots className="icon-btn" />
            <img src={avatar} alt="logo" id='avatar'/>
      </div>

    </div>
  )
}

export default Header
