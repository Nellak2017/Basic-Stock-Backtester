import faker from 'faker'; // todo: Import Data from API instead

export const formInputs = [
    {
        id: 1,
        name: "ticker",
        type: "text",
        placeholder: "ETH-USD",
        label: "Stock Ticker",
        element: "input",
        required: true
    },
    {
        id: 2,
        name: "interval",
        type: "select",
        placeholder: "1M",
        label: "Query Interval",
        element: "select",
        required: true,
        options: [
            {option: "1m"},
            {option: "2m"},
            {option: "5m"},
            {option: "15m"},
            {option: "30m"},
            {option: "90m"},
            {option: "1h"},
            {option: "5d"},
            {option: "1wk"},
            {option: "1mo"},
            {option: "3mo"},
        ]
    },
    {
        id: 3,
        name: "upperSell",
        type: "number",
        placeholder: "1.10",
        label: "Upper Sell",
        element: "input",
        required: true
    },
    {
        id: 4,
        name: "lowerSell",
        type: "number",
        placeholder: ".95",
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
            {option: "Yes"},
            {option: "No"},
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
            {option: "Conservative Momentum"},
            {option: "Adaptive Momentum"},
            {option: "Dollar Cost Averaging"},
            {option: "HODL"},
            {option: "Value Investing"},
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
            {option: "EMA-12"},
            {option: "SMA-12"},
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
            {option: "EMA-24"},
            {option: "SMA-24"},
        ]
    },
];

export const chartStockPeriods = [
    {
        id: 1,
        value: "1D"
    },
    {
        id: 2,
        value: "1W"
    },
    {
        id: 3,
        value: "1M"
    },
    {
        id: 4,
        value: "3M"
    }, 
    {
        id: 5,
        value: "1Y"
    },
    {
        id: 6,
        value: "5Y"
    },
    {
        id: 7,
        value: "ALL"
    },
];

export const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Chart.js Line Chart',
        },
    },
};

// This data will be from the API endpoint
export const chartData = {
    labels,
    datasets: [
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
    ],
};