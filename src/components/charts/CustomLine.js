import React, {useState, useEffect} from 'react'
import {useTheme} from '../../contexts/ThemeContext'
import {Line} from 'react-chartjs-2'
import moment from 'moment'

export default function CustomLine(props) {
    const [data, setData] = useState(props.data)
    const {themeColor} = useTheme()

    const [localTheme, setLocalTheme] = useState(themeColor)

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
    const bgc = getComputedStyle(document.documentElement)
    .getPropertyValue('--bgc-light')

    useEffect(() => {
        setData(props.data)
    }, [props])

    // Force rerenders on color theme change
    useEffect(() => {
        setLocalTheme(themeColor)
    }, [themeColor])

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
                            pointRadius: 4,
                            pointBackgroundColor: borderColor,
                            pointBackgroundColor: borderColor,
                            borderColor: borderColor,
                            borderWidth: 2,
                            lineTension: 0
                        }
                    ]
                }}
                options={{
                    maintainAspectRatio: false,
                    legend: {
                        display: false
                    },
                    tooltips: {
                        titleFontSize: 14,
                        titleFontStyle: 'bold',
                        titleFontColor: colorMain,
                        titleMarginBottom: 15,
                        bodyFontSize: 16,
                        bodyFontColor: colorMain,
                        xPadding: 10, yPadding: 10,
                        callbacks: {
                            label: (tooltipItem, data) => {
                                console.log(tooltipItem)
                                return 'Pace: ' + moment.duration(tooltipItem.value, 'seconds').format('mm:ss')
                            },
                            title: (tooltipItem, data) => {
                                console.log(tooltipItem)
                                return moment(tooltipItem[0].xLabel).format('LLL')
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
                            distribution: 'series',
                            ticks: {
                                fontColor: colorSecondary,
                                fontFamily: getComputedStyle(document.documentElement)
                                .getPropertyValue('--font-family'),
                                source: 'data'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            gridLines: {
                                display: true,
                                color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--bc-chart'),
                                zeroLineWidth: 0,
                                borderDash: [10, 5]
                            },
                            ticks: {
                                fontColor: colorSecondary,
                                fontFamily: getComputedStyle(document.documentElement)
                                .getPropertyValue('--font-family'),
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