import React, {useState, useEffect} from 'react'
import {Line} from 'react-chartjs-2'
import moment from 'moment'

export default function CustomLine(props) {
    const [data, setData] = useState(props.data)

    const borderColor = getComputedStyle(document.documentElement)
    .getPropertyValue(data.borderColor)
    const backgroundColor = getComputedStyle(document.documentElement)
    .getPropertyValue(data.backgroundColor)
    const colorMain = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-header-d')
    const colorSecondary = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-secondary-d')
    const tooltipColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--bgc-light-d')

    useEffect(() => {
        setData(props.data)
    }, [props])

    return (
        <div style={{height: props.height}}>
            <Line 
                data={{
                    labels: data.labels,
                    datasets: [
                        {
                            label: data.label,
                            data: data.dataset,
                            backgroundColor: backgroundColor,
                            pointRadius: 5,
                            pointBackgroundColor: borderColor,
                            borderColor: borderColor,
                            borderWidth: 1,
                        }
                    ]
                }}
                options={{
                    maintainAspectRatio: false,
                    legend: {
                        display: false
                    },
                    tooltips: {
                        backgroundColor: tooltipColor,
                        titleFontSize: 14,
                        titleFontStyle: 'bold',
                        titleFontColor: colorMain,
                        titleMarginBottom: 15,
                        bodyFontSize: 16,
                        bodyFontColor: colorMain,
                        xPadding: 10, yPadding: 10,
                        callbacks: {
                            label: (tooltipItem, data) => {
                                return 'Pace: ' + moment.duration(tooltipItem.value, 'seconds').format('mm:ss')
                            },
                            title: (tooltipItem, data) => {
                                return moment(tooltipItem.value).format('LLL')
                            }
                        }
                    },
                    scales: {
                        xAxes: [{
                            display: true, 
                            gridLines: {
                                display: false
                            },
                            type: 'time',
                            distribution: 'linear',
                            ticks: {
                                source: 'data'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            gridLines: {
                                display: true,
                                borderDash: [10, 5]
                            },
                            ticks: {
                                callback: function (value, index, values) {
                                    if (index === 0 || index === values.length - 1 || index === Math.floor(values.length/2)) {
                                        return moment.duration(value, 'seconds').format('mm:ss')
                                    } else {
                                        return ''
                                    }
                                }
                            }
                        }]
                    }
                    
                }}
            />
        </div>
    )
}