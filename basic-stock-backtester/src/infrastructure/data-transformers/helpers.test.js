import {
    range,
    daysInterval,
    randomColor,
    extractData,
    DTO,
    getDefaultChartData,
    load,
    defaultLoad
} from './helpers';

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
    EMA_UPPER_INDICATOR,
    DEFAULT_RETRIES
} from '../content/constants'

import {
    defaultStockIntervals,
    defaultStock
} from '../content/homeContent'

import { getChartData } from '../api/chartData'

import axios from 'axios';

jest.mock('axios');


/**
 * TODO: FIX THE API TESTING, IT IS NOT DESIGNED TO WORK WITH .THEN SYNTAX
 * TODO: LEARN HOW TO TEST IF API RETRIES OR NOT
 * TODO: LEARN HOW TO TEST USESTATE/USEMEMO HOOK (LIKE IF IT IS BEING UPDATED WITH PROPER VALUES)
 * TODO: EXTRACT OUT THE API TEST TO THE API FOLDER!! NOT THIS FOLDER
 */


describe('Range function should make a list of numbers from 0 to n-1, like Python range', () => {
    const rangeArr = range(0, 10)
    const edge = range(0, 0)
    const negativeRange = range(-5, 0)
    const invalidStr = () => { range("0", "0") }
    const invalidUndef = () => { range("0") }
    const NANtest = () => { range(NaN, NaN) }

    test('range("0","0") should throw an error', () => {
        expect(invalidStr).toThrow(Error); // An Error should be thrown if invalid range params are supplied 
    })

    test('range("0",) should throw an error', () => {
        expect(invalidUndef).toThrow(Error); // An Error should be thrown if invalid range params are supplied 
    })

    test('range(NaN, NaN) should throw an error', () => {
        expect(NANtest).toThrow(Error); // An Error should be thrown if invalid range params are supplied 
    })

    test('range(0,0) should be equal to []', () => {
        expect(edge).toEqual([]); // Array should be [] 
    })

    test('range(0,0) should have 0 length', () => {
        expect(edge.length).toBe(0); // Len should be n
    })

    test('range(a,b) should have first element a', () => {
        expect(rangeArr[0]).toBe(0); // First element should be 0
        expect(negativeRange[0]).toBe(-5); // First element should be -5
    })

    test('range(a,b) should have last element b', () => {
        expect(rangeArr[9]).toBe(9); // Last element should be n-1
        expect(negativeRange[4]).toBe(-1); // Last element should be n-1
    })

    test('range(a,b) should have length b', () => {
        expect(rangeArr.length).toBe(10); // Len should be n
        expect(negativeRange.length).toBe(5); // Len should be n
    })

    test('range(a,b) should have sum equal to n(n-1)/2', () => {
        expect(rangeArr.reduce((a, b) => a + b)).toBe((10 * 9) / 2); // Sum should be n(n-1)/2
        expect(negativeRange.reduce((a, b) => a + b)).toBe(-15); // Sum should be n(n-1)/2
    })

    test('range(a,b) should be a strictly increasing list', () => {
        expect(!!rangeArr.reduce((a, b) => a < b ? b : -1)).toBeTruthy(); // List should be strictly increasing
        expect(!!negativeRange.reduce((a, b) => a < b ? b : 1)).toBeTruthy(); // List should be strictly increasing
    })

});

describe('getDefaultChartData should try to get all the stock period chart data from the API', () => {
    const dummy_stock = defaultStock
    const dummy_available = defaultStockIntervals
    const dummy_retries = DEFAULT_RETRIES
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
    const dummy_available_bad_values = {
        ONE_DAY: 1,
        ONE_WEEK: FIVE_MINUTES,
        ONE_MONTH: FIFTEEN_MINUTES,
        THREE_MONTHS: ONE_HOUR,
        ONE_YEAR: ONE_DAY,
        FIVE_YEARS: ONE_WEEK,
        ALL: ONE_MONTH
    }
    const dummy_function_call = () => {
        getDefaultChartData(
            {
                individualStock: dummy_stock,
                visiblePeriod: ONE_DAY,
                retries: 5,
                availablePeriods: dummy_available
            }
        )
    };
    const dummy_default_function_call = () => { getDefaultChartData() }

    const good_dummystock_keys = Object.keys(dummy_stock)
    const bad_dummystock_keys = Object.keys(dummy_stock_bad_values)
    const good_dummystock_values = Object.values(dummy_stock)
    const bad_dummystock_values = Object.values(dummy_stock_bad_values)

    const good_dummy_available_keys = Object.keys(dummy_available)
    const bad_dummy_available_keys = Object.keys(dummy_available_bad_values)
    const good_dummy_available_values = Object.values(dummy_stock)
    const bad_dummy_available_values = Object.values(dummy_stock_bad_values)

    const TSLA_dummy_API_Response = [
        { 'ticker': 'TSLA', 'date': '2022:05:16 00:00:00', 'value': '747.3599853515625', 'ema24': '2532.290397851563', 'ema12': '2681.1769189453125', 'holding_stock': 'True', 'current_profitability_multiplier': '1.0', 'position_evaluation': 'BUY', 'position_two_step_evaluation': 'BUY and HOLD' },
        { 'ticker': 'TSLA', 'date': '2022:05:17 00:00:00', 'value': '744.52001953125', 'ema24': '2389.495964851563', 'ema12': '2383.666621469351', 'holding_stock': 'False', 'current_profitability_multiplier': '0.9962000028420352', 'position_evaluation': 'SELL', 'position_two_step_evaluation': 'SELL and HOLD' }
    ]; // dummy values given: ticker = 'TSLA', period = 1w , interval = 1d

    // IndividualStock Tests
    describe('parameter individualStock is type [{string:string}] with keys: [ticker, interval, upperSell, lowerSell, ...] and uses valid Default values', () => {

        test('individualStock has all keys of type string', () => {
            expect(good_dummystock_keys.every((e) => { return typeof e === "string" })).toBeTruthy();
        })

        test('individualStock has all values of type string', () => {
            expect(good_dummystock_values.every((e) => { return typeof e === "string" })).toBeTruthy();
            expect(bad_dummystock_values.every((e) => { return typeof e === "string" })).toBeFalsy();
        })

        test('individualStock keys have valid default values defined', () => {
            //expect(getDefaultChartData()).toEqual({"individualStock":defaultStock, "retries":DEFAULT_RETRIES, "availablePeriods":defaultStockIntervals})
        })

        test('individualStock has key ticker', () => {
            expect(good_dummystock_keys.includes("ticker")).toBeTruthy();
            expect(bad_dummystock_keys.includes("ticker")).toBeFalsy();
        })

        test('individualStock has key interval', () => {
            expect(good_dummystock_keys.includes("interval")).toBeTruthy();
            expect(bad_dummystock_keys.includes("interval")).toBeFalsy();
        })

        test('individualStock has key upperSell', () => {
            expect(good_dummystock_keys.includes("upperSell")).toBeTruthy();
            expect(bad_dummystock_keys.includes("upperSell")).toBeFalsy();
        })

        test('individualStock has key lowerSell', () => {
            expect(good_dummystock_keys.includes("lowerSell")).toBeTruthy();
            expect(bad_dummystock_keys.includes("lowerSell")).toBeFalsy();
        })

        test('individualStock has key initHolding', () => {
            expect(good_dummystock_keys.includes("initHolding")).toBeTruthy();
            expect(bad_dummystock_keys.includes("initHolding")).toBeFalsy();
        })

        test('individualStock has key strategy', () => {
            expect(good_dummystock_keys.includes("strategy")).toBeTruthy();
            expect(bad_dummystock_keys.includes("strategy")).toBeFalsy();
        })

        test('individualStock has key lowerIndicator', () => {
            expect(good_dummystock_keys.includes("lowerIndicator")).toBeTruthy();
            expect(bad_dummystock_keys.includes("lowerIndicator")).toBeFalsy();
        })

        test('individualStock has key upperIndicator', () => {
            expect(good_dummystock_keys.includes("upperIndicator")).toBeTruthy();
            expect(bad_dummystock_keys.includes("upperIndicator")).toBeFalsy();
        })

        test('individualStock has key period', () => {
            expect(good_dummystock_keys.includes("period")).toBeTruthy();
            expect(bad_dummystock_keys.includes("period")).toBeFalsy();
        })

        test('individualStock has key interval', () => {
            expect(good_dummystock_keys.includes("interval")).toBeTruthy();
            expect(bad_dummystock_keys.includes("interval")).toBeFalsy();
        })
    })

    // Other Parameter Tests
    describe("getDefaultChartData's other parameters are properly defined to carry out it's function", () => {
        test('parameter retries is type integer and uses Default value', () => {
            expect(Number.isInteger(dummy_retries)).toBeTruthy();
        })

        test('parameter availablePeriods is type [{string:string}] with template [{period:interval}] and is defined', () => {
            expect(good_dummy_available_keys.every((e) => { return typeof e === "string" })).toBeTruthy();
            expect(good_dummy_available_values.every((e) => { return typeof e === "string" })).toBeTruthy();
            expect(bad_dummy_available_values.every((e) => { return typeof e === "string" })).toBeFalsy();
        })
    })

    // getDefaultChartData behavior tests
    describe("getDefaultChartData behaves as expected on Mock Data", () => {


        // TODO: THIS TEST IS NOT CORRECT. RE-WRITE THIS TO BE COMPATIBLE WITH .THEN SYNTAX

        it("should get the expected API data on Sucessful API Response", async () => {
            // given
            // See also: https://vhudyma-blog.eu/3-ways-to-mock-axios-in-jest/
            const TSLA_Mock_Stock = {
                "ticker": "TSLA",
                "interval": ONE_DAY,
                "upperSell": UPPER_SELL,
                "lowerSell": LOWER_SELL,
                "initHolding": INIT_HOLDING,
                "strategy": STRATEGY,
                "lowerIndicator": EMA_LOWER_INDICATOR,
                "upperIndicator": EMA_UPPER_INDICATOR,
                "period": ONE_WEEK,
            }
            axios.get.mockResolvedValueOnce(TSLA_dummy_API_Response);

            // when 
            getChartData(TSLA_Mock_Stock, (res) => {expect(res).toEqual(1)}, (err) => { expect(err).not.toEqual(TSLA_Mock_Stock) });

            // then 
            expect(axios.get).toHaveBeenCalledWith(`http://localhost:5000/${STRATEGY}?ticker=${"TSLA"}&interval=${ONE_DAY}&period=${ONE_WEEK.toLowerCase()}&upperSell=${UPPER_SELL}&lowerSell=${LOWER_SELL}&initHolding=${INIT_HOLDING}&lowerIndicator=${EMA_LOWER_INDICATOR}&upperIndicator=${EMA_UPPER_INDICATOR}`
                , {
                    headers: {
                        'content-type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true
                    }, timeout: 8000
                });
        })

        // TODO: THIS TEST IS NOT CORRECT. RE-WRITE THIS TO BE COMPATIBLE WITH .THEN SYNTAX

        it("should not get the expected API data on Failed API Response", async () => {
            // given
            // See also: https://vhudyma-blog.eu/3-ways-to-mock-axios-in-jest/
            const TSLA_Mock_Stock = {
                "ticker": "TSLA",
                "interval": ONE_DAY,
                "upperSell": UPPER_SELL,
                "lowerSell": LOWER_SELL,
                "initHolding": INIT_HOLDING,
                "strategy": STRATEGY,
                "lowerIndicator": EMA_LOWER_INDICATOR,
                "upperIndicator": EMA_UPPER_INDICATOR,
                "period": ONE_WEEK,
            }
            const message = "Network Error";
            axios.get.mockRejectedValueOnce(new Error(message));

            // when 
            getChartData(TSLA_Mock_Stock, (res) => {expect(res).toEqual([])}, (err) => { expect(err).not.toEqual(TSLA_Mock_Stock) });

            // then 
            expect(axios.get).toHaveBeenCalledWith(`http://localhost:5000/${STRATEGY}?ticker=${"TSLA"}&interval=${ONE_DAY}&period=${ONE_WEEK.toLowerCase()}&upperSell=${UPPER_SELL}&lowerSell=${LOWER_SELL}&initHolding=${INIT_HOLDING}&lowerIndicator=${EMA_LOWER_INDICATOR}&upperIndicator=${EMA_UPPER_INDICATOR}`
                , {
                    headers: {
                        'content-type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true
                    }, timeout: 8000
                });
        })
        it("should retry getting visiblePeriod's API data up to retries times, but short circuit if sucessful", async () => {
            
        })
        it("should not retry getting non-visible periods's API data", () => { })
        it("should setChartDataMemo to the correct values on Sucessful API response", () => {

        })
        it("should not setChartDataMemo on Failed API response", () => { })
        it("should throw an error on Failed API response and display error to console", () => { })
    })
})