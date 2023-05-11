import { UserAddOutlined } from '@ant-design/icons'
import { Avatar, Button, Form, Tooltip, Input } from 'antd'
import React from 'react'
import styled from 'styled-components'
import MessageBox from '../messagebox/messagebox'

const HeaderStyled = styled.div`
    display: flex;
    justify-content: space-between;
    height: 56px;
    padding: 0 16px;
    align-items: center;
    border-bottom: 1px solid rgb(230, 230, 230);

    .header {
        &-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        &-title {
            margin: 0;
            font-weight: bold;
        }

        &-description {
            font-size: 12px;
        }
    }
`

const ButtonGroupStyled = styled.div`
    display: flex;
    align-items: center;
`

const WrapperStyled = styled.div`
    height: 91vh;
`

const ContentStyled = styled.div`
    height: 80.5vh;
    display: flex;
    flex-direction: column;
    padding: 11px;
    justify-content: flex-end;
`

const MessageListStyled = styled.div`
    max-height: 100%;
    overflow-y: auto;
`

const FormStyled = styled(Form)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 2px 2px 0;
    border: 1px solid rgb(230, 230, 230);
    border-radius: 10px; 

    .ant-form-item {
        flex: 1;
        margin-bottom: 0;
    }
`

export default function chatwindow() {
  return (
    <WrapperStyled style={{ marginTop: "9vh" }}>
        <HeaderStyled>
            <div className='header-info'>
                <p className='header-title'>Room 1</p>
                <span className='header-description'>This is room 1.</span>
            </div>

            <ButtonGroupStyled>
                <Button icon={<UserAddOutlined/>}>Invite</Button>
                <Avatar.Group size="small" maxCount={2}>
                    <Tooltip title="Nguyen Van A">
                        <Avatar>A</Avatar>
                    </Tooltip>
                    <Tooltip title="Nguyen Van B">
                        <Avatar>B</Avatar>
                    </Tooltip>
                    <Tooltip title="Nguyen Van C">
                        <Avatar>C</Avatar>
                    </Tooltip>
                    <Tooltip title="Nguyen Van D">
                        <Avatar>D</Avatar>
                    </Tooltip>
                </Avatar.Group>
            </ButtonGroupStyled>
        </HeaderStyled>
        <ContentStyled>
            <MessageListStyled>
                <MessageBox text="Nice to meet you" displayName="Duy Linh" photoURL={null} createdAt={12343123123}/>
                <MessageBox text="How are you?" displayName="Quoc Hung" photoURL={null} createdAt={12343123123}/>
                <MessageBox text="I'm fine thank you." displayName="Thien Khai" photoURL={null} createdAt={12343123123}/>
                <MessageBox text="And you?" displayName="Thanh Chinh" photoURL={null} createdAt={12343123123}/>
                <MessageBox text="I'm doing good" displayName="Duy Linh" photoURL={null} createdAt={12343123123}/>
            </MessageListStyled>
            <FormStyled>
                <Form.Item>
                    <Input placeholder='Type a message...' bordered={false} autoComplete="off"/>
                </Form.Item>
                <Button type='primary'>Send</Button>
            </FormStyled>
        </ContentStyled>
    </WrapperStyled>
  )
}
