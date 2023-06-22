
import React from 'react'
import ReactApexChart from "react-apexcharts";

export default function PieChartPrincipal({ title, data, transactionType }) {
    const result = transactionType ? data.reduce((acc, item) => {
        if (item.loaiGD) {
            if (acc[item.name]) {
                acc[item.name] += item.tongtien;
            } else {
                acc[item.name] = item.tongtien;
            }
        }
        return acc;
    }, {}) : data.reduce((acc, item) => {
        if (!item.loaiGD) {
            if (acc[item.name]) {
                acc[item.name] += item.tongtien;
            } else {
                acc[item.name] = item.tongtien;
            }
        }
        return acc;
    }, {});

    const options = {
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
                            formatter: function (w) {
                                const total = w.globals.seriesTotals.reduce(
                                    (sum, value) => sum + value,
                                    0
                                );
                                if (total >= 1000000000) {
                                    return (total / 1000000000).toFixed(2) + "B";
                                } else if (total >= 1000000) {
                                    return (total / 1000000).toFixed(2) + "M";
                                } else {
                                    return total.toFixed(2);
                                }
                            },
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
            text: title,
        },
    };
    return (
        <div className="box-shadow-card">
            <ReactApexChart options={options} series={Object.values(result)} type="donut" />
        </div>
    )
}
