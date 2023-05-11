import React from 'react'
import {Row, Col, Collapse, Typography, Button} from "antd"
import styled from 'styled-components'
import { PlusOutlined } from '@ant-design/icons'

const { Panel } = Collapse

const PanelStyled = styled(Panel)`
    &&& {
        .ant-collapse-header {
            font-weight: bold;
            font-size: 17px
        }
    }
`

const LinkStyled = styled(Typography.Link)`
    display: block;
    margin-bottom: 5px;

`

export default function chatlist() {
  return (
    <div>
        <Row style={{ marginTop: "9vh", backgroundColor: "#B6EAFA", height: "91vh", padding: "0 5px" }}>
            <Col span={24}>
                <Collapse defaultActiveKey={["1"]} style={{width: "100%"}}>
                    <PanelStyled header="Chat List" key="1">
                        <LinkStyled>Room 1</LinkStyled>
                        <LinkStyled>Room 2</LinkStyled>
                        <LinkStyled>Room 3</LinkStyled>
                        <Button type='text' icon={<PlusOutlined/>} className='add-room'>Create a new room</Button>
                    </PanelStyled>
                </Collapse>
            </Col>
        </Row>
    </div>
  )
}
