import React from 'react'
import { Row, Col } from "antd"
import Chatlist from './chatlist/chatlist'
import Chatwindow from './chatwindow/chatwindow'
import Header from '../components/Header/Header'

export default function chatbox() {
  return (
    <div>
        <Header/>
        <Row>
            <Col span={6}><Chatlist/></Col>
            <Col span={18}><Chatwindow/></Col>
        </Row>
    </div>
  )
}
