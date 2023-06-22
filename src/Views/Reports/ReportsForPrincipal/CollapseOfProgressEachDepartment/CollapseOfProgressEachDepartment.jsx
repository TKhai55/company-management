import { Card, Collapse, Progress, Tooltip } from 'antd'
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../../../Models/firebase/config';

export default function CollapseOfProgressEachDepartment() {
    const [departments, setDepartments] = useState([])
    const [plans, setPlans] = useState([])
    const [transitions, setTransitions] = useState([])
    useEffect(() => {
        const queryForDepartments = query(
            collection(db, "Department")
        );

        const unsubscribe = onSnapshot(queryForDepartments, (snapshot) => {
            const updatedDepartments = [];
            let department = {};

            snapshot.docChanges().forEach((change) => {
                const data = change.doc.data();
                department = { id: change.doc.id, ...data };
                updatedDepartments.push(department);
            });
            setDepartments((prevPlans) => [...updatedDepartments, ...prevPlans]);
        });
        return () => unsubscribe();
    }, [])

    useEffect(() => {
        const queryForPlans = query(
            collection(db, "plan"),
            (
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
    }, [])

    useEffect(() => {
        const queryForTransitions = query(collection(db, "transition"));

        const unsubscribe = onSnapshot(queryForTransitions, (snapshot) => {
            const updatedTransitions = [];
            let transition = {};

            snapshot.docChanges().forEach((change) => {
                const data = change.doc.data();
                transition = { id: change.doc.id, ...data };
                updatedTransitions.push(transition);
            });
            setTransitions((prevTransitions) => [...updatedTransitions, ...prevTransitions]);
        });
        return () => unsubscribe();
    }, [])

    function percentageOfFinish(plan, departmentID, transitions) {
        const filteredTransactions = transitions.filter(
            (transaction) =>
                transaction.department === departmentID &&
                plan.planDetails.some(
                    (planDetail) => planDetail.productID === transaction.productId
                ) &&
                transaction.date.toDate() >= plan.start.toDate() &&
                transaction.date.toDate() <= plan.end.toDate()
        );

        const totalProfit = filteredTransactions.reduce(
            (sum, transaction) => sum + transaction.tongtien,
            0
        );

        const maxProfit = plan.planDetails.reduce(
            (sum, planDetail) => {
                if (planDetail.typeID) {
                    return sum + planDetail.profit;
                }
                return sum;
            },
            0
        );

        const percentageOfSuccess = (totalProfit / maxProfit) * 100;
        return Math.round(percentageOfSuccess * 100) / 100;
    }

    function calculateGeneralPercentageOfSuccess(departmentID) {
        const filteredPlans = plans.filter((plan) =>
            plan.department.includes(departmentID)
        );

        const percentages = filteredPlans.map((plan) =>
            percentageOfFinish(plan, departmentID, transitions)
        );

        const averagePercentage =
            percentages.reduce((sum, percentage) => sum + percentage, 0) /
            filteredPlans.length;

        return Math.round(averagePercentage * 100) / 100;
    }

    return (
        <div style={{ marginLeft: "30px", marginRight: "40px", marginBottom: "50px" }}>
            <Collapse expandIconPosition='end'>
                {
                    departments.map((department, key) => (
                        <Collapse.Panel header={
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <div style={{ width: "30%" }}>{department.name}</div>
                                <Tooltip title="Average percentages of finishing plans" color="rgba(50, 205, 50, .7)" overlayInnerStyle={{ textAlign: "center" }}>
                                    <Progress percent={calculateGeneralPercentageOfSuccess(department.id)} strokeColor={"green"} />
                                </Tooltip>
                            </div>
                        } key={key}>
                            {
                                plans.map((plan, keyPlan) => {
                                    const percent = percentageOfFinish(plan, department.id, transitions)
                                    return (
                                        plan.department.includes(department.id) &&
                                        <Card key={keyPlan}>
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ width: "40%" }}>{plan.title}</div>
                                                <Tooltip title={`${percent}%`} color='cyan'>
                                                    <Progress percent={percent} strokeColor={{
                                                        from: '#108ee9',
                                                        to: '#87d068',
                                                    }} />
                                                </Tooltip>
                                            </div>
                                        </Card>
                                    )
                                })
                            }
                        </Collapse.Panel>
                    ))
                }
            </Collapse>
        </div>
    )
}
