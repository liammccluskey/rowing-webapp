import React, {useState, useEffect} from 'react'
import {Line} from 'react-chartjs-2'

export default function CustomLine(props) {
    const [data, setData] = useState(props.data)

    const borderColor = getComputedStyle(document.documentElement)
    .getPropertyValue(data.borderColor)
    const backgroundColor = getComputedStyle(document.documentElement)
    .getPropertyValue(data.backgroundColor)

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
                            pointRadius: 3,
                            pointBackgroundColor: borderColor,
                            borderColor: borderColor,
                            borderWidth: 1
                        }
                    ]
                }}
                options={{
                    maintainAspectRatio: false,
                    legend: {
                        display: true
                    },
                    scales: {
                        xAxes: [{
                            display: true, 
                            gridLines: {
                                display: false
                            }
                        }],
                        yAxes: [{
                            display: true,
                            gridLines: {
                                display: true,
                                
                            },
                            ticks: {
                                callback: function (value, index, values) {
                                    if (index === 0 || index === values.length || index === Math.floor(values.length/2)) {
                                        return value
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