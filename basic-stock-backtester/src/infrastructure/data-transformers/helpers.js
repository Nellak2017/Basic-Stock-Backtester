// This file contains many of the helper functions used througout the project
// The purpose of placing them here is to be able to easily test them
import {
    ONE_MINUTE,
    DEFAULT_TICKER,
    UPPER_SELL,
    LOWER_SELL,
    DEFAULT_RETRIES
} from '../content/constants'

import {
    defaultStockIntervals,
    defaultStock
} from '../content/homeContent'
/**
 * Functions:
 * 
 * range - (start, end) => [start, ..., end]
 * daysInterval - (intervalStr) => 1 or 7 or 31 or ... days in interval
 * randomColor - () => random color in color list
 * extractData - (lis, value) => extracts all value from list
 * DTO - (period, interval) => returns default .....................................................
 * getDefaultChartData - (retries, visiblePeriod) => Calls Axios API to get Particular stock value and up to 5 others at once
 * load - (period) => setChartData in right format if the data exists, throw an error if it does not
 * defaultLoad - () => setChartData with Default value in the correct format
 * chartData - (dataSetLabels, labels, data, colors) => returns chart data consumed by line chart
 *
 * Examples:
 * 
 * chartData - 
 * (dataSetLabels = ["dataset1","dataset2"], 
 *  labels = ["Jan","Feb","Mar",...], 
 *  data = [{"dataset1": [... numbers], ...}], 
 *  colors = {
        "values": "Black",
        "ema24": "Red",
        "ema12": "Green"
    })
 */

// Function Unit Tests Passing
export const range = (start, end) => {
    if (start === undefined || end === undefined || typeof start !== 'number' || typeof end !== 'number') {
        throw new Error('Entered start or end must be a number');
    } else if (start === 0 && end === 0) {
        return []
    } else {
        return Array(end - start).fill().map((_, idx) => start + idx)
    }
}

export const areSetsEqual = (a, b) => {
    return a.size === b.size && [...a].every(value => b.has(value));
}

// Todo: make this method actually return the correct value
export const daysInterval = (intervalStr) => {
    if (intervalStr.toUpperCase() === "1D") {
        return 1
    } else if (intervalStr.toUpperCase() === "1W") {
        return 7
    } else if (intervalStr.toUpperCase() === "1MO") {
        return 31
    } else if (intervalStr.toUpperCase() === "3MO") {
        return 31 * 3
    } else if (intervalStr.toUpperCase() === "1Y") {
        return 365
    } else if (intervalStr.toUpperCase() === "5Y") {
        return 5 * 365
    }
    else {
        return 5 * 365
    }
}

export const randomColor = () => {
    const colorOptions = ["White", "Red", "Green", "Blue", "Yellow"]
    return colorOptions[Math.floor((Math.random() * colorOptions.length))]
}

export const extractData = (lis, value) => {
    if (lis !== null && lis !== undefined) {
        let dataPoints = []
        for (let dataPoint of lis) {
            dataPoints.push(dataPoint[value]);
        }
        return dataPoints
    }
}

// Todo: Make this as intended
export const DTO = (period, interval, formValues) => {
    return {
        ...formValues,
        period: period,
        interval: interval
    }
}

export const getDefaultChartData = ({individualStock=defaultStock, retries=DEFAULT_RETRIES, availablePeriods=defaultStockIntervals} = {}) => {
    // pass in "1D" as visiblePeriod, 5 retries as standard
    return {"individualStock":individualStock, "retries":retries, "availablePeriods":availablePeriods}
}

export const toBacktesterInput = (APIData) => {
    return [
        {'ticker': 'TSLA', 'date': '2022:04:30 00:00:00', 'value': 2815.533447265625}, 
        {'ticker': 'TSLA', 'date': '2022:05:01 00:00:00', 'value': 2729.994140625}, 
        {'ticker': 'TSLA', 'date': '2022:05:02 00:00:00', 'value': 2827.614013671875}, 
        {'ticker': 'TSLA', 'date': '2022:05:03 00:00:00', 'value': 2857.15234375}
    ]
}

export const chartData = (dataSetLabels, labels, data, colors) => {
    return {
        labels: labels,
        datasets: [
            ...dataSetLabels.map((dataSetLabel) => (
                {
                    label: dataSetLabel,
                    data: data[dataSetLabel],
                    borderColor: colors[dataSetLabel],
                    backgroundColor: colors[dataSetLabel],
                    pointRadius: 0
                }
            ))
        ],
    }
};

/**
        
            {
                label: 'Dataset 1',
                data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Dataset 2',
                data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
 */