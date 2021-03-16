import React, {useState, useEffect} from 'react'
import {Scatter} from 'react-chartjs-2'

export default function CustomScatter(props) {
    const [data, setData] = useState(props.data)

    useEffect(() => {
        setData(props.data)
    }, [props])

    return (
        <div style={{height: props.height}}>
            <Scatter 
                data={{
                    labels: data.labels,
                    datasets: [
                        {
                            label: data.label,
                            data: data.dataset,
                            backgroundColor: getComputedStyle(document.documentElement)
                                .getPropertyValue(data.backgroundColor),
                            pointRadius: 6,
                            pointBackgroundColor: getComputedStyle(document.documentElement)
                            .getPropertyValue(data.backgroundColor),
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