import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import SideMenu from '../../components/SideMenu/SideMenu'
import "./ReportsForPrincipal.css"
import { Card, Col, Divider, Row, Statistic } from 'antd';
import BarChartImportAndExport from './BarChart/BarChart';
import PieChartQuantityProducts from './PieChart/PieChart';
import { ExportOutlined, ImportOutlined } from '@ant-design/icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../Models/firebase/config';
import LineChart from './LineChart/LineChart';
import { formatNumber } from '../../../Controls/ReportController'
import CollapseOfProgressEachDepartment from './CollapseOfProgressEachDepartment/CollapseOfProgressEachDepartment';


export default function ReportsForPrincipal() {
    const [transition, setTransition] = useState([])
    useEffect(() => {
        (async () => {
            const collectionRef = collection(db, "transition");
            const snapshots = await getDocs(collectionRef);
            const docs = snapshots.docs.map((doc) => {
                const data = doc.data();
                data.id = doc.id;

                return data;
            });
            setTransition(docs);
        })();
    }, [])
    let exportTotal = 0;
    let importTotal = 0;

    transition.forEach(item => {
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
                    <Row>
                        <Col>
                            <BarChartImportAndExport />
                        </Col>
                        <Col>
                            <Row gutter={16} style={{ height: "33%", marginTop: "20px", marginLeft: "20px" }}>
                                <Col span={12}>
                                    <Card
                                        className='box-shadow-card'
                                        style={{ height: "100%" }}>
                                        <Statistic
                                            style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
                                            title="Total Import"
                                            value={formatNumber(importTotal)}
                                            valueStyle={{
                                                color: '#3f8600',
                                            }}
                                            suffix="VND"
                                            prefix={<ImportOutlined />}
                                        />
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card
                                        className='box-shadow-card'
                                        style={{ height: "100%" }}
                                    >
                                        <Statistic
                                            style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
                                            title="Total Export"
                                            value={formatNumber(exportTotal)}
                                            valueStyle={{
                                                color: '#cf1322',
                                            }}
                                            suffix="VND"
                                            prefix={<ExportOutlined />}
                                        />
                                    </Card>
                                </Col>
                            </Row>

                            <Row style={{ height: "50%", marginLeft: "10px" }}>
                                <PieChartQuantityProducts />
                            </Row>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={24}>
                            <LineChart />
                        </Col>
                    </Row>
                    <Divider orientation='left'>Progress of Plans in each department</Divider>
                    <CollapseOfProgressEachDepartment />
                </div>
            </div>
        </div>
    )
}
