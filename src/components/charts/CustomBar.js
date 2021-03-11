import React, {useEffect, useState} from 'react'
import {Bar} from 'react-chartjs-2'

/*
    - Custom Bar Chart
    - Height -> from props
    - width -> fill width of container
*/

export default function CustomBar(props) {
    const [data, setData] = useState(props.data)

    useEffect(() => {
        setData(props.data)
    }, [props.data])

    return (
        <div style={{height: props.height}}>
            <Bar
                data={{
                    labels: data.labels,
                    datasets: [
                        {
                            label: data.label,
                            data: data.dataset,
                            backgroundColor: getComputedStyle(document.documentElement)
                                .getPropertyValue(data.backgroundColor),
                            borderWidth: 1,
                            borderColor: getComputedStyle(document.documentElement)
                                .getPropertyValue(data.borderColor),
                            hoverBackgroundColor: getComputedStyle(document.documentElement)
                                .getPropertyValue(data.borderColor)
                        }
                    ]
                }}
                options={{
                    maintainAspectRatio: false,
                    legend: {
                        display: false
                    },
                    title: {
                        display: false,
                    },
                    scales: {
                        xAxes: [{
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                autoSkip: true,
                                maxRotation: 0,
                                minRotation: 0,
                                callback: function(value, index, values) {
                                    if (index % props.labelFreq === 0 || index === values.length - 1) {
                                        if (value.length > props.maxLabelLength) {
                                            return value.substr(0, props.maxLabelLength)
                                        }
                                        return value
                                    } else {
                                        return ''
                                    }
                                }
                            }
                        }],
                        yAxes: [{
                            gridLines: {
                                display: false,
                            },
                            display: false
                            
                        }]
                    }
                }}
            />
        </div>
    )
}