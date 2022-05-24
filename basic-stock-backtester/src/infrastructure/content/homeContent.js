// This file contains any content or data that will be on the front end
import {
    ONE_DAY,
    ONE_WEEK,
    ONE_MONTH,
    THREE_MONTHS,
    ONE_YEAR,
    FIVE_YEARS,
    ALL,
    ONE_MINUTE,
    TWO_MINUTES,
    FIVE_MINUTES,
    FIFTEEN_MINUTES,
    THIRTY_MINUTES,
    NINETY_MINUTES,
    ONE_HOUR,
    FIVE_DAYS,
    DEFAULT_TICKER,
    UPPER_SELL,
    LOWER_SELL,
    INIT_HOLDING,
    STRATEGY,
    EMA_LOWER_INDICATOR,
    EMA_UPPER_INDICATOR
} from '../content/constants'

export const formInputs = [
    {
        id: 1,
        name: "ticker",
        type: "text",
        placeholder: DEFAULT_TICKER,
        label: "Stock Ticker",
        element: "input",
        required: true
    },
    {
        id: 2,
        name: "interval",
        type: "select",
        placeholder: ONE_MONTH,
        label: "Query Interval",
        element: "select",
        required: true,
        options: [
            { option: ONE_MINUTE },
            { option: TWO_MINUTES },
            { option: FIVE_MINUTES },
            { option: FIFTEEN_MINUTES },
            { option: THIRTY_MINUTES },
            { option: NINETY_MINUTES },
            { option: ONE_HOUR },
            { option: ONE_DAY },
            { option: FIVE_DAYS },
            { option: ONE_WEEK },
            { option: ONE_MONTH },
            { option: THREE_MONTHS },
        ]
    },
    {
        id: 3,
        name: "upperSell",
        type: "number",
        placeholder: UPPER_SELL,
        label: "Upper Sell",
        element: "input",
        required: true
    },
    {
        id: 4,
        name: "lowerSell",
        type: "number",
        placeholder: LOWER_SELL,
        label: "Lower Sell",
        element: "input",
        required: true
    },
    {
        id: 5,
        name: "initHolding",
        type: "select",
        placeholder: "No",
        label: "Initially Holding",
        element: "select",
        required: true,
        options: [
            { option: "Yes" },
            { option: "No" },
        ]
    },
    {
        id: 6,
        name: "strategy",
        type: "select",
        placeholder: "Conservative Momentum",
        label: "Strategy",
        element: "select",
        required: true,
        options: [
            { option: "Conservative Momentum" },
            { option: "Adaptive Momentum" },
            { option: "Dollar Cost Averaging" },
            { option: "HODL" },
            { option: "Value Investing" },
        ]
    },
    {
        id: 7,
        name: "lowerIndicator",
        type: "select",
        placeholder: "EMA-12",
        label: "Lower Indicator",
        element: "select",
        required: true,
        options: [
            { option: "EMA-12" },
            { option: "SMA-12" },
        ]
    },
    {
        id: 8,
        name: "upperIndicator",
        type: "select",
        placeholder: "No",
        label: "Upper Indicator",
        element: "select",
        required: true,
        options: [
            { option: "EMA-24" },
            { option: "SMA-24" },
        ]
    },
];

export const chartStockPeriods = [
    {
        id: 1,
        value: ONE_DAY
    },
    {
        id: 2,
        value: ONE_WEEK
    },
    {
        id: 3,
        value: ONE_MONTH
    },
    {
        id: 4,
        value: THREE_MONTHS
    },
    {
        id: 5,
        value: ONE_YEAR
    },
    {
        id: 6,
        value: FIVE_YEARS
    },
    {
        id: 7,
        value: ALL
    },
];

export const chartLabels = ["value"]

export const defaultStockIntervals = {
    [ONE_DAY]: ONE_MINUTE,
    [ONE_WEEK]: FIVE_MINUTES,
    [ONE_MONTH]: FIFTEEN_MINUTES,
    [THREE_MONTHS]: ONE_HOUR,
    [ONE_YEAR]: ONE_DAY,
    [FIVE_YEARS]: ONE_WEEK,
    [ALL]: ONE_MONTH
}

export const defaultAPIData = {
    [ONE_DAY]: [],
    [ONE_WEEK]: [],
    [ONE_MONTH]: [],
    [THREE_MONTHS]: [],
    [ONE_YEAR]: [],
    [FIVE_YEARS]: [],
    [ALL]: []
}

export const defaultStock = {
    "ticker": DEFAULT_TICKER,
    "interval": ONE_MINUTE,
    "upperSell": UPPER_SELL,
    "lowerSell": LOWER_SELL,
    "initHolding": INIT_HOLDING,
    "strategy": STRATEGY,
    "lowerIndicator": EMA_LOWER_INDICATOR,
    "upperIndicator": EMA_UPPER_INDICATOR,
    "period": ONE_DAY,
}

export const colors = {
    "values": "Black",
    "ema24": "Red",
    "ema12": "Green"
}

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: false,
            text: '',
        },
    },
};

export const defaultResData = [
    {
        'ticker': 'ETH-USD',
        'date': '2022:05:12 15:30:00',
        'value': "1939.252685546875",
        'ema24': "1962.0431567382811",
        'ema12': "2458.7604017991284",
        'holding_stock': "True",
        'current_profitability_multiplier': "1.0",
        'position_evaluation': 'HOLD',
        'position_two_step_evaluation': 'HOLD and HOLD'
    }]
