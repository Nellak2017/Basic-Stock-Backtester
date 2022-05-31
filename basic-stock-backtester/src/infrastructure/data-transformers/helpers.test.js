import * as helpers from './helpers'
import * as CONSTANTS from '../content/constants'
import * as content from '../content/homeContent'
import { getChartData } from '../api/chartData'
import axios from 'axios'
import moment from 'moment'

jest.mock('axios')

// @todo: Test Axios Retry

describe('Range function should make a list of numbers from 0 to n-1, like Python range', () => {
    const rangeArr = helpers.range(0, 10)
    const edge = helpers.range(0, 0)
    const negativeRange = helpers.range(-5, 0)
    const invalidStr = () => { helpers.range("0", "0") }
    const invalidUndef = () => { helpers.range("0") }
    const NANtest = () => { helpers.range(NaN, NaN) }

    it('helpers.range("0","0") should throw an error', () => expect(invalidStr).toThrow(Error))
    it('helpers.range("0",) should throw an error', () => expect(invalidUndef).toThrow(Error))
    it('helpers.range(NaN, NaN) should throw an error', () => expect(NANtest).toThrow(Error))
    it('helpers.range(0,0) should be equal to []', () => expect(edge).toEqual([]))
    it('helpers.range(0,0) should have 0 length', () => expect(edge.length).toBe(0))
    it('helpers.range(a,b) should have first element a', () => {
        expect(rangeArr[0]).toBe(0) 
        expect(negativeRange[0]).toBe(-5) 
    })
    it('helpers.range(a,b) should have last element b', () => {
        expect(rangeArr[9]).toBe(9) 
        expect(negativeRange[4]).toBe(-1) 
    })
    it('helpers.range(a,b) should have length b', () => {
        expect(rangeArr.length).toBe(10) 
        expect(negativeRange.length).toBe(5) 
    })
    it('helpers.range(a,b) should have sum equal to n(n-1)/2', () => {
        expect(rangeArr.reduce((a, b) => a + b)).toBe((10 * 9) / 2) 
        expect(negativeRange.reduce((a, b) => a + b)).toBe(-15) 
    })
    it('helpers.range(a,b) should be a strictly increasing list', () => {
        expect(!!rangeArr.reduce((a, b) => a < b ? b : -1)).toBeTruthy()
        expect(!!negativeRange.reduce((a, b) => a < b ? b : 1)).toBeTruthy() 
    })
})

describe('getDefaultChartData should try to get all the stock period chart data from the API', () => {
    const dummy_stock = content.defaultStock
    const dummy_available = content.defaultStockIntervals
    const dummy_retries = CONSTANTS.DEFAULT_RETRIES
    const dummy_stock_bad_values = {
        "ticker_": "ETH-USD",
        "interval_": "1M",
        "upperSell_": 1.1,
        "lowerSell_": ".95",
        "initHolding_": "false",
        "strategy_": "Conservative-Momentum",
        "lowerIndicator_": "EMA-24",
        "upperIndicator_": "EMA-12",
        "period_": "1D",
    }
    const good_dummystock_keys = Object.keys(dummy_stock)
    const bad_dummystock_keys = Object.keys(dummy_stock_bad_values)
    const good_dummystock_values = Object.values(dummy_stock)
    const bad_dummystock_values = Object.values(dummy_stock_bad_values)

    const good_dummy_available_keys = Object.keys(dummy_available)
    const good_dummy_available_values = Object.values(dummy_stock)
    const bad_dummy_available_values = Object.values(dummy_stock_bad_values)

    const TSLA_dummy_API_Response = {
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
                                    75: 743,
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
    } // dummy values given: ticker = 'TSLA', period = 1w , interval = 1d

    // IndividualStock Tests
    describe('parameter individualStock is type [{string:string}] with keys: [ticker, interval, upperSell, lowerSell, ...] and uses valid Default values', () => {
        it('individualStock has all keys of type string', () => expect(good_dummystock_keys.every((e) => { return typeof e === "string" })).toBeTruthy())
        it('individualStock has all values of type string', () => {
            expect(good_dummystock_values.every((e) => { return typeof e === "string" })).toBeTruthy()
            expect(bad_dummystock_values.every((e) => { return typeof e === "string" })).toBeFalsy()
        })
        it('individualStock has key ticker', () => {
            expect(good_dummystock_keys.includes("ticker")).toBeTruthy()
            expect(bad_dummystock_keys.includes("ticker")).toBeFalsy()
        })
        it('individualStock has key interval', () => {
            expect(good_dummystock_keys.includes("interval")).toBeTruthy()
            expect(bad_dummystock_keys.includes("interval")).toBeFalsy()
        })
        it('individualStock has key upperSell', () => {
            expect(good_dummystock_keys.includes("upperSell")).toBeTruthy()
            expect(bad_dummystock_keys.includes("upperSell")).toBeFalsy()
        })
        it('individualStock has key lowerSell', () => {
            expect(good_dummystock_keys.includes("lowerSell")).toBeTruthy()
            expect(bad_dummystock_keys.includes("lowerSell")).toBeFalsy()
        })
        it('individualStock has key initHolding', () => {
            expect(good_dummystock_keys.includes("initHolding")).toBeTruthy()
            expect(bad_dummystock_keys.includes("initHolding")).toBeFalsy()
        })
        it('individualStock has key strategy', () => {
            expect(good_dummystock_keys.includes("strategy")).toBeTruthy()
            expect(bad_dummystock_keys.includes("strategy")).toBeFalsy()
        })
        it('individualStock has key lowerIndicator', () => {
            expect(good_dummystock_keys.includes("lowerIndicator")).toBeTruthy()
            expect(bad_dummystock_keys.includes("lowerIndicator")).toBeFalsy()
        })
        it('individualStock has key upperIndicator', () => {
            expect(good_dummystock_keys.includes("upperIndicator")).toBeTruthy()
            expect(bad_dummystock_keys.includes("upperIndicator")).toBeFalsy()
        })
        it('individualStock has key period', () => {
            expect(good_dummystock_keys.includes("period")).toBeTruthy()
            expect(bad_dummystock_keys.includes("period")).toBeFalsy()
        })
        it('individualStock has key interval', () => {
            expect(good_dummystock_keys.includes("interval")).toBeTruthy()
            expect(bad_dummystock_keys.includes("interval")).toBeFalsy()
        })
    })

    // Other Parameter Tests
    describe("getDefaultChartData's other parameters are properly defined to carry out it's function", () => {
        it('parameter retries is type integer and uses Default value', () => expect(Number.isInteger(dummy_retries)).toBeTruthy())
        it('parameter availablePeriods is type [{string:string}] with template [{period:interval}] and is defined', () => {
            expect(good_dummy_available_keys.every((e) => { return typeof e === "string" })).toBeTruthy()
            expect(good_dummy_available_values.every((e) => { return typeof e === "string" })).toBeTruthy()
            expect(bad_dummy_available_values.every((e) => { return typeof e === "string" })).toBeFalsy()
        })
    })

    // getDefaultChartData behavior tests
    describe("getDefaultChartData behaves as expected on Mock Data", () => {

        describe("should get the expected API data on Sucessful API Response", () => {
            // See also: https://vhudyma-blog.eu/3-ways-to-mock-axios-in-jest/
            const TSLA_Mock_Stock = {
                "ticker": "TSLA",
                "interval": CONSTANTS.ONE_DAY,
                "period": CONSTANTS.ONE_WEEK
            }
            axios.get.mockResolvedValue(TSLA_dummy_API_Response)
            it("Expect the API response to not be undefined", async () => await expect(getChartData(TSLA_Mock_Stock)).not.toBe(undefined))
            it("Expect the field meta to be defined", async () => {
                // Get Server Response 
                const response = await getChartData(TSLA_Mock_Stock)
                const firstDataPoint = response.chart.result[0].meta
                expect(firstDataPoint).not.toBe(undefined)
            })
            it("Expect the field timestamp to be defined", async () => {
                // Get Server Response 
                const response = await getChartData(TSLA_Mock_Stock)
                const firstDataPoint = response.chart.result[0].timestamp
                expect(firstDataPoint).not.toBe(undefined)
            })
            it("Expect the field quote to be defined", async () => {
                // Get Server Response 
                const response = await getChartData(TSLA_Mock_Stock)
                const firstDataPoint = response.chart.result[0].indicators.quote[0]
                expect(firstDataPoint).not.toBe(undefined)
            })
            it("Expect the values to be in the correct format", async () => {
                // Get Server Response 
                const response = await getChartData(TSLA_Mock_Stock)
                const firstDataPoint = response.chart.result[0].indicators.quote[0].close[0]
                expect(Object.values(firstDataPoint).every(value => typeof value === 'number')).toBeTruthy()
            })
            it("Should call the server once with the proper data", async () => {
                // Expect Server to have been called with this string
                expect(axios.get).toHaveBeenCalledWith("https://yh-finance.p.rapidapi.com/stock/v3/get-chart"
                    , {
                        params: {
                            interval: TSLA_Mock_Stock["interval"],
                            symbol: TSLA_Mock_Stock["ticker"],
                            range: TSLA_Mock_Stock["period"],
                            period1: undefined,
                            period2: undefined,
                            region: 'US',
                            includePrePost: 'false',
                            useYfid: 'true',
                            includeAdjustedClose: 'true',
                            events: 'capitalGain,div,split'
                        },
                        headers: {
                            'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com',
                            'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY
                        }, timeout: 4000
                    })
            })
        })
    })
})

describe('toBacktesterInput should convert API data into proper form to be handled by Memo', () => {
    // Mock Data (Limited Version of a Fake API Response) and Variables
    // ------------------
    const goodInput = {
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
    const badInput = []
    const noMetaIn = {
        "chart": {
            "result": [
                {
                    "timestamp": {
                        0: 1622035800,
                        1: 1622122200,
                    },
                    "indicators": {
                        "quote": [
                            {
                                "close": {
                                    0: 619.1300048828125,
                                    1: 630.8499755859375,
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
    const noDataIn = {
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
                    }
                }
            ]
        }
    }
    const noTimeIn = {
        "chart": {
            "result": [
                {
                    "meta": {
                        "symbol": "TSLA",
                        "dataGranularity": "1d",
                        "range": "1y"
                    },
                    "indicators": {
                        "quote": [
                            {
                                "close": {
                                    0: 619.1300048828125,
                                    1: 630.8499755859375,
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
    const noResultsIn = {
        "chart": {
            
        }
    }
    const invalidTicker = {
        "chart": {
            "result": [
                {
                    "meta": {
                        "symbol": "T",
                        "dataGranularity": "1d",
                        "range": "1y"
                    },
                    "timestamp": {
                        0: 1622035800,
                        1: 1622122200,
                    },
                    "indicators": {
                        "quote": [
                            {
                                "close": {
                                    0: 619.1300048828125,
                                    1: 630.8499755859375,
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
    const invalidTimeStamp = {
        "chart": {
            "result": [
                {
                    "meta": {
                        "symbol": "TSLA",
                        "dataGranularity": "1d",
                        "range": "1y"
                    },
                    "timestamp": {
                        0: "1622035800",
                        1: 1622122200,
                    },
                    "indicators": {
                        "quote": [
                            {
                                "close": {
                                    0: 619.1300048828125,
                                    1: 630.8499755859375,
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
    const invalidStockValue = {
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
                    },
                    "indicators": {
                        "quote": [
                            {
                                "close": {
                                    0: "619.1300048828125",
                                    1: 630.8499755859375,
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }

    const goodInputTimeStamps = goodInput.chart.result[0].timestamp
    const goodInputMeta = goodInput.chart.result[0].meta
    const goodInputIndicators = goodInput.chart.result[0].indicators

    // Mock Functions
    // ------------------
    const goodInputFx = helpers.toBacktesterInput(goodInput)

    const badInputFx = () => helpers.toBacktesterInput(badInput)
    const badInputFx2 = () => helpers.toBacktesterInput(noMetaIn)
    const badInputFx3 = () => helpers.toBacktesterInput(noDataIn)
    const badInputFx4 = () => helpers.toBacktesterInput(noTimeIn)
    const badInputFx5 = () => helpers.toBacktesterInput(noResultsIn)
    const badInputFx6 = () => helpers.toBacktesterInput(invalidTicker)
    const badInputFx7 = () => helpers.toBacktesterInput(invalidTimeStamp)
    const badInputFx8 = () => helpers.toBacktesterInput(invalidStockValue)

    // Variables
    // ------------------
    const expectedKeys = new Set(["ticker", "date", "value"])
    const receivedKeys = goodInputFx.map(dicts => Object.keys(dicts))
    const receivedKeysGood = receivedKeys.every(keylist => helpers.areSetsEqual(new Set(keylist), expectedKeys))

    // Backtester Function Tests
    // ------------------
    describe('function should throw errors on improper inputs', () => {
        it("should throw an error if API Meta Data is unavailable", () => {
            expect(badInputFx).toThrow(Error)
            expect(badInputFx2).toThrow(/Meta/)
        })
        it("should throw an error if API results are unavailable", () => expect(badInputFx5).toThrow(/Results/))
        it("should throw an error if API Stock values are unavailable", () => expect(badInputFx3).toThrow(/Stock/))
        it("should throw an error if API timestamps is unavailable", () => expect(badInputFx4).toThrow(/Timestamp/))
        it("should throw an error if API ticker is invalid", () => {
            expect(CONSTANTS.MATCH_TICKER.test(invalidTicker.chart.result[0].meta.symbol)).toBeFalsy()
            expect(badInputFx6).toThrow(/Invalid Ticker/)
        })
        it("should throw an error if API timestamp is invalid", () => {
            expect(Object.values(invalidTimeStamp).every(dict => CONSTANTS.MATCH_DATETIME.test(dict["date"]))).toBeFalsy()
            expect(badInputFx7).toThrow(/Invalid Timestamp/)
        })
        it("should throw an error if API stock values are invalid", () => {
            expect(Object.values(invalidStockValue).every(dict => CONSTANTS.MATCH_FLOAT.test(dict["value"]))).toBeFalsy()
            expect(badInputFx8).toThrow(/Invalid Stock Value/)
        })
    })

    describe('function should convert a list of values into a list of dictionaries, consumable by backtester', () => {
        it('goodInput returned function should be a list', () => expect(Array.isArray(goodInputFx)).toBeTruthy())
        it("should return an array with length equal to input's value array length", () => expect(goodInputFx.length === Object.values(goodInputIndicators.quote[0].close).length).toBeTruthy())
        it("should have proper output keys", () => expect(receivedKeysGood).toBeTruthy())
        it("should have proper format for values", () => {
            const tickerValid = goodInputFx.every(dict => CONSTANTS.MATCH_TICKER.test(dict["ticker"]))
            const dateValid = goodInputFx.every(dict => CONSTANTS.MATCH_DATETIME.test(dict["date"]))
            const valueValid = goodInputFx.every(dict => CONSTANTS.MATCH_FLOAT.test(dict["value"]))

            expect(tickerValid).toBeTruthy()
            expect(dateValid).toBeTruthy()
            expect(valueValid).toBeTruthy()
        })
    })

    describe('function should return proper values', () => {
        it('should have the correct date/time for each dictionary in the output list', () => {
            const formattedDateTimes = Object.values(goodInputTimeStamps).map(unixDate => moment.unix(unixDate).format(CONSTANTS.DATE_FORMAT)) // [formattedDates: str]
            expect(goodInputFx.every((dict, index) => formattedDateTimes[index] === dict["date"])).toBeTruthy()
        })
        it('should have the correct ticker for each dictionary in the output list', () => expect(goodInputFx.every(dict => goodInputMeta.symbol === dict["ticker"])).toBeTruthy())
        it('should have the correct value for each dictionary in the output list', () => expect(goodInputFx.every((dict, index) => Object.values(goodInputIndicators["quote"][0]["close"])[index] === dict["value"])).toBeTruthy())
    })
})