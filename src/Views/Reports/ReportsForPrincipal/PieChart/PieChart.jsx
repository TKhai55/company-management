import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../../../Models/firebase/config';
import ReactApexChart from "react-apexcharts";

export default function PieChartQuantityProducts() {
    const [products, setProducts] = useState([])
    const result = products.reduce((acc, item) => {
        const { name, sl } = item;
        acc[name] = sl;
        return acc;
    }, {});

    const state = {
        series: Object.values(result),
        options: {
            chart: {
                width: 380,
                type: "donut",
                dropShadow: {
                    enabled: true,
                    color: "#111",
                    top: -1,
                    left: 3,
                    blur: 3,
                    opacity: 0.2,
                },
            },
            stroke: {
                width: 0,
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            total: {
                                showAlways: true,
                                show: true,
                            },
                        },
                    },
                },
            },
            labels: Object.keys(result),
            dataLabels: {
                dropShadow: {
                    blur: 3,
                    opacity: 0.8,
                },
            },
            states: {
                hover: {
                    filter: "none",
                },
            },
            title: {
                text: "Amount Of Each Product",
            },
        },
    };

    useEffect(() => {
        (async () => {
            const collectionRef = collection(db, "products");
            const snapshots = await getDocs(collectionRef);
            const docs = snapshots.docs.map((doc) => {
                const data = doc.data();
                data.id = doc.id;

                return data;
            });
            setProducts(docs);
        })();
    }, [])
    return (
        <div className='pie-chart-report-manager box-shadow-card'>
            <ReactApexChart
                options={state.options}
                series={state.series}
                type="donut"
            />
        </div>
    )
}
