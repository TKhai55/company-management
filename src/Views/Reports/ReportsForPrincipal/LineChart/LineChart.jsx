import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import ReactApexChart from "react-apexcharts";
import { db } from '../../../../Models/firebase/config';


export default function LineChart() {
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

    const result = transition.reduce((acc, transaction) => {
        const { tongtien, loaiGD, date } = transaction;
        const monthIndex = date.toDate().getMonth() + 1

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
        series: [
            {
                name: "Import",
                data: result.import
            },
            {
                name: "Export",
                data: result.export
            }
        ],
        chart: {
            type: 'line',
            dropShadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.2
            },
            toolbar: {
                show: false
            }
        },
        colors: ['#77B6EA', '#545454'],
        dataLabels: {
            enabled: true,
        },
        stroke: {
            curve: 'smooth'
        },
        title: {
            text: 'Average Transaction',
            align: 'left'
        },
        grid: {
            borderColor: '#e7e7e7',
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
            },
        },
        markers: {
            size: 1
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', "Aug", "Sep", "Oct", "Nov", "Dec"],
            title: {
                text: 'Month'
            }
        },
        yaxis: {
            title: {
                text: 'Temperature'
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -25,
            offsetX: -5
        }
    };
    return (
        <div className='box-shadow-card' style={{
            marginLeft: "20px",
            marginRight: "45px",
            marginTop: "20px",
        }}>
            <ReactApexChart
                height={280}
                options={options}
                series={options.series}
                type="line"
            />
        </div>
    )
}
