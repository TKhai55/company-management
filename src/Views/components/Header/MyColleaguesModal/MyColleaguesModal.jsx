import { Avatar, List, Modal, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import { VideoCameraOutlined } from '@ant-design/icons';

export default function MyColleagues({ isModalOpen, handleCancel, departmentID, userID, colleaguesList }) {
    const [sameDepartmentColleagues, setSameDepartmentColleagues] = useState([])
    const [othersColleagues, setOthersColleagues] = useState([])
    const renderListColleagues = (list) => (
        <List
            pagination={{
                position: "bottom",
                align: "center",
                pageSize: 4
            }}
            itemLayout="horizontal"
            dataSource={list}
            renderItem={(item, index) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={item.photoURL ? <Avatar src={item.photoURL} /> : <Avatar>{item.email?.charAt(3).toUpperCase()}</Avatar>}
                        title={item.displayName ? item.displayName : item.email}
                        description={`${item.role}`}
                    />
                    {item.isMe ? <div style={{ color: "gray" }}>Me</div> : <VideoCameraOutlined />}
                </List.Item>
            )}
        />
    )
    const items = [
        {
            key: '1',
            label: `My Department`,
            children: renderListColleagues(sameDepartmentColleagues),
        },
        {
            key: '2',
            label: `Others`,
            children: renderListColleagues(othersColleagues),
        }
    ];
    useEffect(() => {
        colleaguesList.forEach(colleague => {
            if (colleague.department !== departmentID) {
                setOthersColleagues(prev => [...prev, colleague])
            } else if (colleague.department === departmentID) {
                if (colleague.uid === userID) {
                    colleague.isMe = true
                }
                setSameDepartmentColleagues(prev => [...prev, colleague])
            }
        })
    }, [colleaguesList, departmentID]);

    return (
        <>
            <Modal title="My Colleagues" open={isModalOpen} onCancel={handleCancel} bodyStyle={{ height: 400 }}>
                <Tabs defaultActiveKey="1" items={items} />
            </Modal >
        </>
    )
}
