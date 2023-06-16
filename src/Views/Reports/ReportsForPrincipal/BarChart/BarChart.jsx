import React, { useEffect, useState } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { collection, getDocs } from 'firebase/firestore';
import { Select } from 'antd';
import { db } from '../../../../Models/firebase/config';

export default function BarChartImportAndExport() {
    const [plans, setPlans] = useState([])
    const [selectedMonth, setSelectedMonth] = useState("");

    useEffect(() => {
        (async () => {
            const collectionRef = collection(db, "transition");
            const snapshots = await getDocs(collectionRef);
            const docs = snapshots.docs.map((doc) => {
                const data = doc.data();
                data.id = doc.id;

                return data;
            });
            setPlans(docs);
        })();
    }, [])

    const combinedData = plans.reduce((acc, item) => {
        const { name, tongtien, loaiGD, date } = item;

        const productName = name.charAt(0).toUpperCase() + name.slice(1);
        const month = date.toDate().getMonth() + 1
        const existingProduct = acc.find((product) => product.productName === productName);

        if (existingProduct) {
            if (loaiGD) {
                existingProduct.Export += tongtien;
            } else {
                existingProduct.Import += tongtien;
            }
        } else {
            const newProduct = {
                productName,
                Export: loaiGD ? tongtien : 0,
                Import: !loaiGD ? tongtien : 0,
                month
            };
            acc.push(newProduct);
        }

        return acc.filter(item => {
            if (selectedMonth === "") {
                return item
            } else {
                return item.month == selectedMonth;
            }
        });
    }, []);
    return (
        <div className='line-chart-report-manager box-shadow-card'>
            <p style={{ fontWeight: "bold" }}>Import / Export</p>
            <Select
                style={{
                    marginBottom: 10,
                    width: 120
                }}
                defaultValue={"All Months"}
                onChange={(v) => setSelectedMonth(v)}
                options={[
                    {
                        value: "",
                        label: "All Months"
                    },
                    {
                        value: "1",
                        label: "January"
                    },
                    {
                        value: "2",
                        label: "February"
                    },
                    {
                        value: "3",
                        label: "March"
                    },
                    {
                        value: "4",
                        label: "April"
                    },
                    {
                        value: "5",
                        label: "May"
                    },
                    {
                        value: "6",
                        label: "June"
                    },
                    {
                        value: "7",
                        label: "July"
                    },
                    {
                        value: "8",
                        label: "August"
                    },
                    {
                        value: "9",
                        label: "September"
                    },
                    {
                        value: "10",
                        label: "October"
                    },
                    {
                        value: "11",
                        label: "November"
                    },
                    {
                        value: "12",
                        label: "December"
                    },
                ]}
            />
            <BarChart width={500} height={200} data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="productName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Export" fill="#8884d8" />
                <Bar dataKey="Import" fill="#82ca9d" />
            </BarChart>
        </div>
    )
}
