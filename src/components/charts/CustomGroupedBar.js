import React, {useEffect, useState} from 'react'
import {Bar} from 'react-chartjs-2'
import {useTheme} from '../../contexts/ThemeContext'

/*
    - Custom Bar Chart
    - Height -> from props
    - width -> fill width of container
*/

export default function CustomGroupedBar(props) {
    const [data, setData] = useState(props.data)
    const {themeColor} = useTheme()
    const [localTheme, setLocalTheme] = useState(themeColor)

    useEffect(() => {
        setData(props.data)
    }, [props])


    // Force rerenders on color theme change
    useEffect(() => {
        setLocalTheme(themeColor)
    }, [themeColor])

    return (
        <div style={{height: props.height}}>
            <Bar
                data={{
                    labels: data.labels,
                    datasets: data.datasets.map((set, idx) => ({
                        label: set.label,
                        data: set.data,
                        borderWidth: 1,
                        backgroundColor: getComputedStyle(document.documentElement)
                        .getPropertyValue(set.backgroundColor),
                        borderColor: getComputedStyle(document.documentElement)
                            .getPropertyValue(set.borderColor),
                        hoverBackgroundColor: getComputedStyle(document.documentElement)
                            .getPropertyValue(set.borderColor),
                        hoverBorderColor: getComputedStyle(document.documentElement)
                        .getPropertyValue(set.borderColor)

                    }))
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
                                display: false,
                                drawBorder: false
                            },
                            ticks: {
                                autoSkip: false,
                                fontColor: getComputedStyle(document.documentElement)
                                .getPropertyValue('--color-secondary'),
                                fontFamily: getComputedStyle(document.documentElement)
                                .getPropertyValue('--font-family'),
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
                                display: false
                            },
                            ticks: {
                                display: props.showYTicks,
                                fontColor: getComputedStyle(document.documentElement)
                                .getPropertyValue('--color-secondary'),
                                callback: function (value, index, values) {
                                    if (index === 0 || index === values.length - 1 || index === Math.floor(values.length/2)) {
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