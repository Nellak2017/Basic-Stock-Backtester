// This file contains many of the helper functions used througout the project
// The purpose of placing them here is to be able to easily test them
import {
    ONE_MINUTE,
    DEFAULT_TICKER,
    UPPER_SELL,
    LOWER_SELL,
    DEFAULT_RETRIES,
    DATE_FORMAT,
    MATCH_TICKER,
    MATCH_DATETIME,
    MATCH_FLOAT
} from '../content/constants'

import {
    defaultStockIntervals,
    defaultStock
} from '../content/homeContent'
import moment from 'moment';

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

export const getDefaultChartData = ({ individualStock = defaultStock, retries = DEFAULT_RETRIES, availablePeriods = defaultStockIntervals } = {}) => {
    // pass in "1D" as visiblePeriod, 5 retries as standard
    return { "individualStock": individualStock, "retries": retries, "availablePeriods": availablePeriods }
}

export const toBacktesterInput = (APIData) => {
    // Input Validation
    // ------------------
    if (APIData === undefined) throw new Error("All API Data is missing inside of toBacktesterInput function. Ensure API Data passed in is correct.")
    if (APIData?.chart === undefined) throw new Error("Chart is missing from input APIData inside of the toBacktesterInput function. Make sure your API data is correct.")
    if (APIData.chart?.result === undefined) throw new Error("Results are missing from input APIData inside of the toBacktesterInput function. Make sure your API data is correct.")
    if (APIData.chart.result[0]?.meta === undefined) throw new Error("Meta Data is missing from input APIData inside of the toBacktesterInput function. Make sure your API data is correct.")
    if (APIData.chart.result[0]?.timestamp === undefined) throw new Error("Timestamp Data is missing from input APIData inside of the toBacktesterInput function. Make sure your API data is correct.")
    if (APIData.chart.result[0]?.indicators === undefined) throw new Error("Stock Data is missing from input APIData inside of the toBacktesterInput function. Make sure your API data is correct.")

    // Variables
    // ------------------
    const results = APIData?.chart?.result[0]
    const ticker = results?.meta?.symbol
    const unixTimestamps = Object.values(results?.timestamp)
    const values = Object.values(results?.indicators?.quote[0]?.close)

    // More Input Validation
    // ------------------
    if (typeof ticker !== "string" || !MATCH_TICKER.test(ticker)) throw new Error("Invalid Ticker found inside of toBacktesterInput function. Ensure all Tickers are between 2 and 5 characters long and are all strings too.")
    if (!unixTimestamps.every(timestamp => typeof timestamp === "number" && MATCH_FLOAT.test(timestamp))) throw new Error("Invalid Timestamp found inside of toBacktesterInput function. Ensure all Timestamps are floating point numbers or integers, but not strings or any other type.")
    if (!values.every(value => typeof value === "number" && MATCH_FLOAT.test(value))) throw new Error("Invalid Stock Value(s) found inside of toBacktesterInput function. Ensure all Timestamps are floating point numbers or integers, but not strings or any other type.")

    // Convert Unix dates to String Formatted Dates
    // ------------------
    const formattedDateTimes = unixTimestamps.map(unixDate => moment.unix(unixDate).format(DATE_FORMAT))
    // Ensure formatted date time has proper format
    if (formattedDateTimes.every(datetime => typeof datetime === 'string' && MATCH_DATETIME.test(datetime)))

    // Make the list of Objects in the proper format, and return it
    // ------------------
    return values.map((value, index) => ({ "ticker": ticker, "date": formattedDateTimes[index], "value": value }))
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