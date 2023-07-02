import React, { useContext, useEffect, useRef, useState } from 'react'
import Header from '../../components/Header/Header'
import SideMenu from '../../components/SideMenu/SideMenu'
import { useParams } from 'react-router-dom'
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../../Models/firebase/config'
import { Card, Col, Divider, Row, Statistic } from 'antd'
import { ExportOutlined, ImportOutlined } from '@ant-design/icons'
import { formatNumber } from '../../../Controls/ReportController'
import PieChartPrincipal from './PieChart/PieChart'
import CollapseOfProgress from './CollapseOfProgress/CollapseOfProgress'
import { AuthContext } from '../../components/Context/AuthProvider'

export default function ReportsForManager() {
    const { user: { department } } = useContext(AuthContext)
    const [transitions, setTransitions] = useState([])

    console.log({ department })

    let exportQuantity = useRef(null)
    let importQuantity = useRef(null)

    useEffect(() => {
        exportQuantity.current = 0
        importQuantity.current = 0
        const q = query(
            collection(db, "transition"),
            where("department", "==", department)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const updatedTransition = [];
            let Transition = {};

            snapshot.docChanges().forEach((change) => {
                const data = change.doc.data();
                data.loaiGD ? exportQuantity.current = exportQuantity.current + 1 : importQuantity.current = importQuantity.current + 1
                Transition = { id: change.doc.id, ...data };
                updatedTransition.push(Transition);
            });
            setTransitions((prevTransition) => [...updatedTransition, ...prevTransition]);
        });
        return () => unsubscribe();
    }, [])

    let exportTotal = 0;
    let importTotal = 0;

    transitions.forEach(item => {
        if (item.loaiGD) {
            exportTotal += item.tongtien;
        } else {
            importTotal += item.tongtien;
        }
    });

    return (
        <div className="App-container">
            <Header />
            <div className="App-Content-container">
                <SideMenu />
                <div className="App-Content-Main">
                    <Divider orientation='left'>General Reports Information</Divider>
                    <Row gutter={16} style={{
                        marginTop: "20px",
                        marginLeft: "20px"
                    }}>
                        <Col>
                            <Row>
                                <Card
                                    className='box-shadow-card'
                                    style={{ height: "100%", width: "100%" }}>
                                    <Statistic
                                        style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
                                        title="Import Quantity"
                                        value={importQuantity.current}
                                        valueStyle={{
                                            color: '#3f8600',
                                        }}
                                        prefix={<ImportOutlined />}
                                    />
                                </Card>
                            </Row>
                            <Row>
                                <Card
                                    className='box-shadow-card'
                                    style={{ height: "100%", width: "100%" }}>
                                    <Statistic
                                        style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
                                        title="Total Import"
                                        value={formatNumber(importTotal)}
                                        valueStyle={{
                                            color: '#3f8600',
                                        }}
                                        suffix="VND"
                                    />
                                </Card>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Card
                                    className='box-shadow-card'
                                    style={{ height: "100%", width: "100%" }}>
                                    <Statistic
                                        style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
                                        title="Export Quantity"
                                        value={exportQuantity.current}
                                        valueStyle={{
                                            color: '#cf1322',
                                        }}
                                        prefix={<ExportOutlined />}
                                    />
                                </Card>
                            </Row>
                            <Row>
                                <Card
                                    className='box-shadow-card'
                                    style={{ height: "100%", width: "100%" }}>
                                    <Statistic
                                        style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
                                        title="Total Export"
                                        value={formatNumber(exportTotal)}
                                        valueStyle={{
                                            color: '#cf1322',
                                        }}
                                        suffix="VND"
                                    />
                                </Card>
                            </Row>
                        </Col>
                        <Col>
                            <Row style={{ height: "100%" }}>
                                <PieChartPrincipal title="Export By Products" data={transitions} transactionType={true} />
                            </Row>
                        </Col>
                        <Col>
                            <Row style={{ height: "100%" }}>
                                <PieChartPrincipal title="Export By Products" data={transitions} transactionType={false} />
                            </Row>
                        </Col>
                    </Row>
                    <Divider orientation='left' >Progress of Plans in your department</Divider>
                    <CollapseOfProgress />
                </div>
            </div>
        </div>
    )
}
