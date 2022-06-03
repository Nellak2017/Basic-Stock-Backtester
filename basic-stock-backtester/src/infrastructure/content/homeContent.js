// This file contains any content or data that will be on the front end
import * as CONSTANTS from '../content/constants'

export const formInputs = [
    {
        id: 1,
        name: "ticker",
        type: "text",
        placeholder: CONSTANTS.DEFAULT_TICKER,
        label: "Stock Ticker",
        element: "input",
        required: true
    },
    {
        id: 2,
        name: "interval",
        type: "select",
        placeholder: CONSTANTS.ONE_MONTH,
        label: "Query Interval",
        element: "select",
        required: true,
        options: [
            { option: CONSTANTS.ONE_MINUTE },
            { option: CONSTANTS.TWO_MINUTES },
            { option: CONSTANTS.FIVE_MINUTES },
            { option: CONSTANTS.FIFTEEN_MINUTES },
            { option: CONSTANTS.THIRTY_MINUTES },
            { option: CONSTANTS.NINETY_MINUTES },
            { option: CONSTANTS.ONE_HOUR },
            { option: CONSTANTS.ONE_DAY },
            { option: CONSTANTS.FIVE_DAYS },
            { option: CONSTANTS.ONE_WEEK },
            { option: CONSTANTS.ONE_MONTH },
            { option: CONSTANTS.THREE_MONTHS },
        ]
    },
    {
        id: 3,
        name: "upperSell",
        type: "number",
        placeholder: CONSTANTS.UPPER_SELL,
        label: "Upper Sell",
        element: "input",
        required: true
    },
    {
        id: 4,
        name: "lowerSell",
        type: "number",
        placeholder: CONSTANTS.LOWER_SELL,
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
        value: CONSTANTS.ONE_DAY
    },
    {
        id: 2,
        value: CONSTANTS.ONE_WEEK
    },
    {
        id: 3,
        value: CONSTANTS.ONE_MONTH
    },
    {
        id: 4,
        value: CONSTANTS.THREE_MONTHS
    },
    {
        id: 5,
        value: CONSTANTS.ONE_YEAR
    },
    {
        id: 6,
        value: CONSTANTS.FIVE_YEARS
    },
];

export const chartLabels = ["value"]

export const defaultStockIntervals = {
    [CONSTANTS.ONE_DAY]: CONSTANTS.ONE_MINUTE,
    [CONSTANTS.ONE_WEEK]: CONSTANTS.FIVE_MINUTES,
    [CONSTANTS.ONE_MONTH]: CONSTANTS.FIFTEEN_MINUTES,
    [CONSTANTS.THREE_MONTHS]: CONSTANTS.ONE_HOUR,
    [CONSTANTS.ONE_YEAR]: CONSTANTS.ONE_DAY,
    [CONSTANTS.FIVE_YEARS]: CONSTANTS.ONE_WEEK,
}

export const defaultAPIData = {
    [CONSTANTS.ONE_DAY]: {},
    [CONSTANTS.ONE_WEEK]: {},
    [CONSTANTS.ONE_MONTH]: {},
    [CONSTANTS.THREE_MONTHS]: {},
    [CONSTANTS.ONE_YEAR]: {},
    [CONSTANTS.FIVE_YEARS]: {},
}

export const defaultSMA = {
    [CONSTANTS.ONE_DAY]: {"sma12": -1, "sma24": -1},
    [CONSTANTS.ONE_WEEK]: {"sma12": -1, "sma24": -1},
    [CONSTANTS.ONE_MONTH]: {"sma12": -1, "sma24": -1},
    [CONSTANTS.THREE_MONTHS]: {"sma12": -1, "sma24": -1},
    [CONSTANTS.ONE_YEAR]: {"sma12": -1, "sma24": -1},
    [CONSTANTS.FIVE_YEARS]: {"sma12": -1, "sma24": -1},
}

export const defaultTestAPIData = {
    "chart": {
        "result": [
            {
                "meta": {
                    "symbol": "TSLA",
                    "dataGranularity": "1d",
                    "range": "1y"
                },
                "timestamp": {
                    0: 1622035800,
                    1: 1622122200,
                    2: 1622208600,
                    3: 1622554200,
                    4: 1622640600,
                    5: 1622727000,
                    6: 1622813400,
                    7: 1623072600,
                    8: 1623159000,
                    9: 1623245400,
                    10: 1623331800,
                    11: 1623418200,
                    12: 1623677400,
                    13: 1623763800,
                    14: 1623850200,
                    15: 1623936600,
                    16: 1624023000,
                    17: 1624282200,
                    18: 1624368600,
                    19: 1624455000,
                    20: 1624541400,
                    21: 1624627800,
                    22: 1624887000,
                    23: 1624973400,
                    24: 1625059800,
                    25: 1625146200,
                    26: 1625232600,
                    27: 1625578200,
                    28: 1625664600,
                    29: 1625751000,
                    30: 1625837400,
                    31: 1626096600,
                    32: 1626183000,
                    33: 1626269400,
                    34: 1626355800,
                    35: 1626442200,
                    36: 1626701400,
                    37: 1626787800,
                    38: 1626874200,
                    39: 1626960600,
                    40: 1627047000,
                    41: 1627306200,
                    42: 1627392600,
                    43: 1627479000,
                    44: 1627565400,
                    45: 1627651800,
                    46: 1627911000,
                    47: 1627997400,
                    48: 1628083800,
                    49: 1628170200,
                    50: 1628256600,
                    51: 1628515800,
                    52: 1628602200,
                    53: 1628688600,
                    54: 1628775000,
                    55: 1628861400,
                    56: 1629120600,
                    57: 1629207000,
                    58: 1629293400,
                    59: 1629379800,
                    60: 1629466200,
                    61: 1629725400,
                    62: 1629811800,
                    63: 1629898200,
                    64: 1629984600,
                    65: 1630071000,
                    66: 1630330200,
                    67: 1630416600,
                    68: 1630503000,
                    69: 1630589400,
                    70: 1630675800,
                    71: 1631021400,
                    72: 1631107800,
                    73: 1631194200,
                    74: 1631280600,
                    75: 1631539800,
                    76: 1631626200,
                    77: 1631712600,
                    78: 1631799000,
                    79: 1631885400,
                    80: 1632144600,
                    81: 1632231000,
                    82: 1632317400,
                    83: 1632403800,
                    84: 1632490200,
                    85: 1632749400,
                    86: 1632835800,
                    87: 1632922200,
                    88: 1633008600,
                    89: 1633095000,
                    90: 1633354200,
                    91: 1633440600,
                    92: 1633527000,
                    93: 1633613400,
                    94: 1633699800,
                    95: 1633959000,
                    96: 1634045400,
                    97: 1634131800,
                    98: 1634218200,
                    99: 1634304600
                },
                "indicators": {
                    "quote": [
                        {
                            "close": {
                                0: 619.1300048828125,
                                1: 630.8499755859375,
                                2: 625.219970703125,
                                3: 623.9000244140625,
                                4: 605.1199951171875,
                                5: 572.8400268554688,
                                6: 599.0499877929688,
                                7: 605.1300048828125,
                                8: 603.5900268554688,
                                9: 598.780029296875,
                                10: 610.1199951171875,
                                11: 609.8900146484375,
                                12: 617.6900024414062,
                                13: 599.3599853515625,
                                14: 604.8699951171875,
                                15: 616.5999755859375,
                                16: 623.3099975585938,
                                17: 620.8300170898438,
                                18: 623.7100219726562,
                                19: 656.5700073242188,
                                20: 679.8200073242188,
                                21: 671.8699951171875,
                                22: 688.719970703125,
                                23: 680.760009765625,
                                24: 679.7000122070312,
                                25: 677.9199829101562,
                                26: 678.9000244140625,
                                27: 659.5800170898438,
                                28: 644.6500244140625,
                                29: 652.8099975585938,
                                30: 656.9500122070312,
                                31: 685.7000122070312,
                                32: 668.5399780273438,
                                33: 653.3800048828125,
                                34: 650.5999755859375,
                                35: 644.219970703125,
                                36: 646.219970703125,
                                37: 660.5,
                                38: 655.2899780273438,
                                39: 649.260009765625,
                                40: 643.3800048828125,
                                41: 657.6199951171875,
                                42: 644.780029296875,
                                43: 646.97998046875,
                                44: 677.3499755859375,
                                45: 687.2000122070312,
                                46: 709.6699829101562,
                                47: 709.739990234375,
                                48: 710.9199829101562,
                                49: 714.6300048828125,
                                50: 699.0999755859375,
                                51: 713.760009765625,
                                52: 709.989990234375,
                                53: 707.8200073242188,
                                54: 722.25,
                                55: 717.1699829101562,
                                56: 686.1699829101562,
                                57: 665.7100219726562,
                                58: 688.989990234375,
                                59: 673.469970703125,
                                60: 680.260009765625,
                                61: 706.2999877929688,
                                62: 708.489990234375,
                                63: 711.2000122070312,
                                64: 701.1599731445312,
                                65: 711.9199829101562,
                                66: 730.9099731445312,
                                67: 735.719970703125,
                                68: 734.0900268554688,
                                69: 732.3900146484375,
                                70: 733.5700073242188,
                                71: 752.9199829101562,
                                72: 753.8699951171875,
                                73: 754.8599853515625,
                                74: 736.27001953125,
                                75: 743.0,
                                76: 744.489990234375,
                                77: 755.8300170898438,
                                78: 756.989990234375,
                                79: 759.489990234375,
                                80: 730.1699829101562,
                                81: 739.3800048828125,
                                82: 751.9400024414062,
                                83: 753.6400146484375,
                                84: 774.3900146484375,
                                85: 791.3599853515625,
                                86: 777.5599975585938,
                                87: 781.3099975585938,
                                88: 775.47998046875,
                                89: 775.219970703125,
                                90: 781.530029296875,
                                91: 780.5900268554688,
                                92: 782.75,
                                93: 793.6099853515625,
                                94: 785.489990234375,
                                95: 791.9400024414062,
                                96: 805.719970703125,
                                97: 811.0800170898438,
                                98: 818.3200073242188,
                                99: 843.030029296875,
                            }
                        }
                    ]
                }
            }
        ]
    }
}

export const defaultFormValues = {
    "ticker": CONSTANTS.DEFAULT_TICKER,
    "interval": CONSTANTS.ONE_MINUTE,
    "upperSell": CONSTANTS.UPPER_SELL,
    "lowerSell": CONSTANTS.LOWER_SELL,
    "initHolding": CONSTANTS.INIT_HOLDING,
    "strategy": CONSTANTS.STRATEGY,
    "lowerIndicator": CONSTANTS.EMA_LOWER_INDICATOR,
    'upperIndicator': CONSTANTS.EMA_UPPER_INDICATOR
}

export const defaultDisplayed = {
    [CONSTANTS.ONE_DAY]: {"values": [], "ema12": [], "ema24": []},
    [CONSTANTS.ONE_WEEK]: {"values": [], "ema12": [], "ema24": []},
    [CONSTANTS.ONE_MONTH]: {"values": [], "ema12": [], "ema24": []},
    [CONSTANTS.THREE_MONTHS]: {"values": [], "ema12": [], "ema24": []},
    [CONSTANTS.ONE_YEAR]: {"values": [], "ema12": [], "ema24": []},
    [CONSTANTS.FIVE_YEARS]: {"values": [], "ema12": [], "ema24": []},
}

export const defaultStock = {
    "ticker": CONSTANTS.DEFAULT_TICKER,
    "interval": CONSTANTS.ONE_MINUTE,
    "upperSell": CONSTANTS.UPPER_SELL,
    "lowerSell": CONSTANTS.LOWER_SELL,
    "initHolding": CONSTANTS.INIT_HOLDING,
    "strategy": CONSTANTS.STRATEGY,
    "lowerIndicator": CONSTANTS.EMA_LOWER_INDICATOR,
    "upperIndicator": CONSTANTS.EMA_UPPER_INDICATOR,
    "period": CONSTANTS.ONE_DAY,
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
