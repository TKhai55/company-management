import { Card, Collapse, Progress, Tooltip } from 'antd';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../../../../Models/firebase/config';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../../components/Context/AuthProvider';

export default function CollapseOfProgress() {
    const { user: { department } } = useContext(AuthContext)
    const [transitions, setTransitions] = useState([])
    const [plans, setPlans] = useState([])

    useEffect(() => {
        const queryForTransactions = query(
            collection(db, "transition"),
            where("department", "==", department)
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
    }, [department])

    useEffect(() => {
        const queryForPlans = query(
            collection(db, "plan"),
            (
                where("department", "==", department),
                where("isConfirm", "==", true)
            )
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
    }, [department])


    function percent(plan, participant, transactions) {
        const filteredTransactions = transactions.filter(
            (transaction) =>
                transaction.nguoigiaodichID === participant.participantID &&
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
        <div style={{ marginLeft: "30px", marginRight: "90px" }}>
            <Collapse expandIconPosition="end">
                {
                    plans.map((plan, keyPlan) => (
                        <Collapse.Panel header={`${plan.title}`} key={keyPlan + 1}>
                            <Card>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <div style={{ width: "40%" }}>{plan.name}</div>
                                    <Tooltip title={`${percent(plan, { participantID: plan.employeeID }, transitions)}%`} color='cyan'>
                                        <Progress percent={percent(plan, { participantID: plan.employeeID }, transitions)} strokeColor={{
                                            from: '#108ee9',
                                            to: '#87d068',
                                        }} />
                                    </Tooltip>
                                </div>
                            </Card>
                            {
                                plan.participants.map(participant => {
                                    const calculatePercent = percent(plan, participant, transitions)
                                    return (participant.role.includes("Employee") &&
                                        <Card>
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ width: "40%" }}>{participant.displayName}</div>
                                                <Tooltip title={`${calculatePercent}%`} color='cyan'>
                                                    <Progress percent={calculatePercent} strokeColor={{
                                                        from: '#108ee9',
                                                        to: '#87d068',
                                                    }} />
                                                </Tooltip>
                                            </div>
                                        </Card>
                                    )
                                }
                                )}
                        </Collapse.Panel>
                    ))
                }
            </Collapse>
        </div>
    )
}
