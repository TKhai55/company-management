import React, { useContext, useEffect, useState } from 'react'
import Header from '../Header'
import SideMenu from '../../SideMenu/SideMenu'
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import ReactApexChart from "react-apexcharts";
import { db } from '../../../../Models/firebase/config';
import { AuthContext } from '../../Context/AuthProvider';
import { Card, Divider, Progress, Tooltip } from 'antd';

export default function MyInsights() {
    const [transitions, setTransitions] = useState([])
    const [plans, setPlans] = useState([])
    const { user: { uid } } = useContext(AuthContext)

    useEffect(() => {
        const queryForTransactions = query(
            collection(db, "transition"),
            where("nguoigiaodichID", "==", uid)
        );

        const unsubscribe = onSnapshot(queryForTransactions, (snapshot) => {
            const updatedTransition = [];
            let Transition = {};

            snapshot.docChanges().forEach((change) => {
                const data = change.doc.data();
                Transition = { id: change.doc.id, ...data };
                updatedTransition.push(Transition);
            });
            setTransitions((prevTransition) => [...updatedTransition, ...prevTransition]);
        });
        return () => unsubscribe();
    }, [])

    useEffect(() => {
        const queryForPlans = query(
            collection(db, "plan"),
            where("isConfirm", "==", true)
            // where("participants", "array-contains", { participantID: uid })
        );

        const unsubscribe = onSnapshot(queryForPlans, (snapshot) => {
            const updatedPlans = [];
            let plans = {};

            snapshot.docChanges().forEach((change) => {
                const data = change.doc.data();
                plans = { id: change.doc.id, ...data };
                updatedPlans.push(plans);
            });
            setPlans((prevPlans) => [...updatedPlans, ...prevPlans]);
        });
        return () => unsubscribe();
    }, [])

    console.log({ transitions })
    const result = transitions.reduce((acc, transaction) => {
        const { tongtien, loaiGD, date } = transaction;
        const monthIndex = date.toDate().getMonth()

        if (loaiGD) {
            acc.export[monthIndex] += tongtien;
        } else {
            acc.import[monthIndex] += tongtien;
        }

        return acc;
    }, {
        import: Array(12).fill(0),
        export: Array(12).fill(0)
    });
    var options = {
        chart: {
            type: 'line'
        },
        series: [{
            name: 'Total Import',
            data: result.import
        },
        {
            name: "Total Export",
            data: result.export
        }],
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    // Add commas every three digits
                    const formattedValue = value.toLocaleString() + " VND"
                    return formattedValue;
                },
            },
        },
        legend: {
            tooltipHoverFormatter: function (val, opts) {
                return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex].toLocaleString() + ' VND'
            }
        },
    }

    function percent(plan, transactions) {
        const filteredTransactions = transactions.filter(
            (transaction) =>
                plan.planDetails.some(
                    (planDetail) => planDetail.productID === transaction.productId
                ) &&
                transaction.date <= plan.end && transaction.date >= plan.start
        );

        const totalProfit = filteredTransactions.reduce(
            (sum, transaction) => sum + transaction.tongtien,
            0
        );

        const maxProfit = plan.planDetails.reduce(
            (sum, planDetail) => sum + planDetail.profit,
            0
        );

        let percentageOfSuccess = (totalProfit / maxProfit) * 100;
        percentageOfSuccess = Math.min(percentageOfSuccess, 100).toFixed(2);
        return percentageOfSuccess;
    }

    return (
        <div className="App-container">
            <Header />
            <div className="App-Content-container">
                <SideMenu />
                <div
                    className="App-Content-Main"
                    style={{
                        paddingLeft: 40,
                        paddingRight: 40,
                        paddingTop: 20,
                        paddingBottom: 20,
                    }}
                >
                    <Divider orientation='left'>Total export and import over 12 months</Divider>
                    <ReactApexChart
                        options={options}
                        series={options.series}
                        height={300}
                    />
                    <Divider orientation='left'>Progress of assigned plans</Divider>
                    {
                        plans.map((plan, keyPlan) => {
                            const percentage = percent(plan, transitions)
                            return (
                                (plan.employeeID.includes(uid) || plan.participants.some(participant => participant.participantID.includes(uid))) &&
                                <Card key={keyPlan}>
                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                        <div style={{ width: "40%" }}>{plan.title}</div>
                                        <Tooltip title={`${percentage}%`}>
                                            <Progress percent={percentage} />
                                        </Tooltip>
                                    </div>
                                </Card>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
