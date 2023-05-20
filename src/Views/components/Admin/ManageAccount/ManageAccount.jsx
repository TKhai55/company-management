import { DeleteOutlined } from '@ant-design/icons'
import { Button, Input, Space, Switch, Table, Tooltip } from 'antd'
import { collection, getDocs } from 'firebase/firestore'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { db } from '../../../../Models/firebase/config'
import Header from '../../Header/Header'
import SideMenu from '../../SideMenu/SideMenu'
import { GoPrimitiveDot } from "react-icons/go"

export default function ManageAccount() {

    const [userArray, setUserArray] = useState([])
    const [searchText, setSearchText] = useState("")
    const [disabled, setDisabled] = useState(true);
    const [activeStatus, setActiveStatus] = useState(true)
    const [backgroundColor, setBackgroundColor] = useState("")

    const toggle = () => {
        setDisabled(!disabled)
    };

    useEffect(() => {
        ; (async () => {
            const collectionRef = collection(db, "users")
            const snapshots = await getDocs(collectionRef)
            const docs = snapshots.docs.map((doc) => {
                const data = doc.data()
                data.id = doc.id

                return data
            })
            setUserArray(docs)
        })()
    }, [])

    console.log({ userArray })

    const filteredItems = userArray.filter(
        (item) =>
            item.email.toLowerCase().includes(searchText.toLowerCase()) ||
            item.role.toString().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: <span style={{ color: '#4ca3f5', fontWeight: 'bold' }}>UID</span>,
            dataIndex: 'uid',
            key: 'uid',
            align: 'center',
            sorter: (a, b) => a.uid.localeCompare(b.uid),
        },
        {
            title: <span style={{ color: '#4ca3f5', fontWeight: 'bold' }}>Email</span>,
            dataIndex: 'email',
            key: 'email',
            align: 'center',
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: <span style={{ color: '#4ca3f5', fontWeight: 'bold' }}>Role</span>,
            dataIndex: 'role',
            key: 'role',
            align: 'center',
            sorter: (a, b) => a.role.localeCompare(b.role),
        },
        {
            title: <span style={{ color: '#4ca3f5', fontWeight: 'bold' }}>Status</span>,
            dataIndex: 'isActive',
            key: 'isActive',
            align: 'center',
            render: (text) => text ? "Active" : "Inactive"
        },
        {
            title: <span style={{ color: '#4ca3f5', fontWeight: 'bold' }}>Action</span>,
            key: 'action',
            align: 'center',
            render: (_, record, index) => {
                return (
                    <Space direction="vertical">
                        <Switch disabled={disabled} defaultChecked
                            onChange={(checked) => {
                                setActiveStatus(checked)
                                console.log(record)
                            }}
                            style={{
                                // backgroundColor: `${record[index].isActive ? "green" : "red"}`,
                            }} />
                    </Space>
                )
            },
        },
    ];

    return (
        <div className="App-container">
            <Header />
            <div className="App-Content-container">
                <SideMenu />
                <div className="App-Content-Main">
                    <div style={{
                        display: "flex",
                        marginTop: "7.5vh",
                        flexDirection: "column",
                        alignItems: "center",
                        paddingLeft: "10%",
                        paddingRight: "10%"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                            <Input.Search
                                style={{
                                    width: "30%",
                                    marginBottom: "3%",
                                    justifySelf: "flex-start"
                                }}
                                placeholder="Enter keywords"
                                enterButton="Search"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onSearch={(value) => setSearchText(value)}
                            />
                            <Button type="primary" onClick={toggle} style={{
                                justifySelf: "flex-end"
                            }}>
                                Change status of account
                            </Button>
                        </div>
                        <Table columns={columns} dataSource={filteredItems} style={{
                            width: "100%",
                            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                            borderRadius: "10px"
                        }} />
                    </div>
                </div>
            </div>
        </div>
    )
}
