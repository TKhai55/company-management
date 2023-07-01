import { Avatar, List, Modal, Tabs } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { VideoCameraOutlined } from '@ant-design/icons';
import { addDoc, collection } from 'firebase/firestore';
import firebase, { db } from '../../../../Models/firebase/config';
import { AuthContext } from '../../Context/AuthProvider';

export default function MyColleagues({ isModalOpen, handleCancel, departmentID, userID, colleaguesList }) {
    const [sameDepartmentColleagues, setSameDepartmentColleagues] = useState([])
    const [othersColleagues, setOthersColleagues] = useState([])
    const { user: { displayName, uid } } = useContext(AuthContext)
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
                    {item.isMe ? <div style={{ color: "gray" }}>Me</div> : <VideoCameraOutlined onClick={() => handleClickCall(item.displayName, item.uid)} />}
                </List.Item>
            )}
        />
    )

    const handleClickCall = async (colleagueName, colleagueID) => {
        await addDoc(collection(db, "calls"), {
            callerID: uid,
            caller: displayName,
            receiverID: colleagueID,
            receiver: colleagueName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        window.open(`https://852a-222-253-129-76.ngrok-free.app/MeetingWith${colleagueName}`, "_blank", "noreferrer");
    }
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
