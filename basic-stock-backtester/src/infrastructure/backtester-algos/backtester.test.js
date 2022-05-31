import {
    conservativeMomentumStrategyEvaluationFunction,
    ema,
    conservativeMomentumBacktesterFunction
} from '../backtester-algos/backtester'
import { UPPER_SELL, LOWER_SELL } from "../content/constants"

describe("conservativeMomentumStrategyEvaluationFunction should behave correctly", () => {

    const dataPoint = {
        "value_1": 630,
        "value_2": 632,
        "ema24_1": 600,
        "ema24_2": 605,
        "ema12_1": 650,
        "ema12_2": 625,
        "stock_holding": true,
        "buy_point": 575
    }
    const badBuyDataPoint = {
        "value_1": 630,
        "value_2": 632,
        "ema24_1": 600,
        "ema24_2": 605,
        "ema12_1": 650,
        "ema12_2": 625,
        "stock_holding": true,
        "buy_point": "575"
    }
    const goodStrategy = () => conservativeMomentumStrategyEvaluationFunction(dataPoint, parseFloat(UPPER_SELL), parseFloat(LOWER_SELL))
    const badDataPoint = () => conservativeMomentumStrategyEvaluationFunction([], parseFloat(UPPER_SELL), parseFloat(LOWER_SELL))
    const invalidDataPoint = () => conservativeMomentumStrategyEvaluationFunction(badBuyDataPoint, parseFloat(UPPER_SELL), parseFloat(LOWER_SELL))
    const badUpperSell = () => conservativeMomentumStrategyEvaluationFunction(dataPoint, "123", parseFloat(LOWER_SELL))
    const badLowerSell = () => conservativeMomentumStrategyEvaluationFunction(dataPoint, parseFloat(UPPER_SELL), "123")

    describe("The function should validate it's parameters", () => {
        it("should throw an error if dataPoint has invalid keys", () => expect(badDataPoint).toThrow(Error))
        it("should throw an error if the values of dataPoint are not numbers, execept for stock_holding", () => expect(invalidDataPoint).toThrow(Error))
        it("should throw an error if given a bad upperSell", () => expect(badUpperSell).toThrow(Error))
        it("should throw an error if given a bad lowerSell", () => expect(badLowerSell).toThrow(Error))
        it("should not throw an error if given a valid input", () => expect(goodStrategy).not.toThrow(Error))
    })

    describe("The function should return an evaulation string that is one of only a few enum values", () => {
        it("should have a return value in the set {'BUY','SELL','HOLD'}", () => expect(goodStrategy()).toMatch(/BUY|SELL|HOLD/))
    })

    describe("The function should return the correct evaluation for the stock", () => {
        it("should return BUY when not holding and ema is increasing ", () => {
            const notHoldingEmaIncreasingNotDoublePos = {
                "value_1": 630,
                "value_2": 632,
                "ema24_1": 630,
                "ema24_2": 605,
                "ema12_1": 625,
                "ema12_2": 650,
                "stock_holding": false,
                "buy_point": 575
            }
            expect(conservativeMomentumStrategyEvaluationFunction(notHoldingEmaIncreasingNotDoublePos, parseFloat(UPPER_SELL), parseFloat(LOWER_SELL))).toMatch(/BUY/)
        })

        it("should return BUY when not holding and ema is double positive ", () => {
            const notHoldingEmaIncreasingDoublePos = {
                "value_1": 630,
                "value_2": 632,
                "ema24_1": 600,
                "ema24_2": 605,
                "ema12_1": 650,
                "ema12_2": 625,
                "stock_holding": false,
                "buy_point": 575
            }
            expect(conservativeMomentumStrategyEvaluationFunction(notHoldingEmaIncreasingDoublePos, parseFloat(UPPER_SELL), parseFloat(LOWER_SELL))).toMatch(/BUY/)
        })

        it("should return SELL when holding and v2 >= top", () => {
            // value 2 > UPPER_SELL * buy_point === 633 > 632.5
            const HoldingAndV2MoreThanTop = {
                "value_1": 630,
                "value_2": 633,
                "ema24_1": 630,
                "ema24_2": 605,
                "ema12_1": 625,
                "ema12_2": 650,
                "stock_holding": true,
                "buy_point": 575
            }
            expect(conservativeMomentumStrategyEvaluationFunction(HoldingAndV2MoreThanTop, parseFloat(UPPER_SELL), parseFloat(LOWER_SELL))).toMatch(/SELL/)
        })

        it("should return SELL when holding and v2 <= bottom", () => {
            // value 2 < LOWER_SELL * buy_point ===  545 < 546.25
            const HoldingAndV2LessThanBottom = {
                "value_1": 630,
                "value_2": 545,
                "ema24_1": 630,
                "ema24_2": 605,
                "ema12_1": 625,
                "ema12_2": 650,
                "stock_holding": true,
                "buy_point": 575
            }
            expect(conservativeMomentumStrategyEvaluationFunction(HoldingAndV2LessThanBottom, parseFloat(UPPER_SELL), parseFloat(LOWER_SELL))).toMatch(/SELL/)
        })

        it("should return SELL when holding and ema_decreasing ", () => {
            // dataPoint["ema12_1"] - dataPoint["ema24_1"] > 0 && 0 > dataPoint["ema12_2"] - dataPoint["ema24_2"]
            // 630 - 625 > 0 && 0 > 605 - 650 === true
            const HoldingAndV2EmaDecreasing = {
                "value_1": 630,
                "value_2": 633,
                "ema24_1": 625,
                "ema24_2": 650,
                "ema12_1": 630,
                "ema12_2": 605,
                "stock_holding": true,
                "buy_point": 575
            }
            expect(conservativeMomentumStrategyEvaluationFunction(HoldingAndV2EmaDecreasing, parseFloat(UPPER_SELL), parseFloat(LOWER_SELL))).toMatch(/SELL/)
        })

        it("should return SELL when holding ema_double_negative", () => {
            // ema1 = dataPoint["ema12_1"] - dataPoint["ema24_1"] 
            // ema2 = dataPoint["ema12_2"] - dataPoint["ema24_2"]
            // ema1 < 0 && ema2 < 0 && !(ema1 > 0 && 0 > ema2) && !(ema1 < 0 && 0 < ema2)
            // --------
            // ema1 = 625 - 630 === -5
            // ema2 = 605 - 650 === -45
            // -5 < 0 && -45 < 0 && !(-5 > 0 && 0 > -45) && !(-5 < 0 && 0 < -45) === true

            const HoldingAndEmaDoubleNegative = {
                "value_1": 630,
                "value_2": 633,
                "ema24_1": 630,
                "ema24_2": 650,
                "ema12_1": 625,
                "ema12_2": 605,
                "stock_holding": true,
                "buy_point": 575
            }
            expect(conservativeMomentumStrategyEvaluationFunction(HoldingAndEmaDoubleNegative, parseFloat(UPPER_SELL), parseFloat(LOWER_SELL))).toMatch(/SELL/)
        })

        describe("should hold when not BUY or SELL", () => {
            it("should hold when holding stock and ema is double negative", () => {
                const notHoldingEmaDoubleNegative = {
                    "value_1": 630,
                    "value_2": 633,
                    "ema24_1": 630,
                    "ema24_2": 650,
                    "ema12_1": 625,
                    "ema12_2": 605,
                    "stock_holding": false,
                    "buy_point": 575
                }
                expect(conservativeMomentumStrategyEvaluationFunction(notHoldingEmaDoubleNegative, parseFloat(UPPER_SELL), parseFloat(LOWER_SELL))).toMatch(/HOLD/)
            })

            it("should hold when holding stock and ema is decreasing", () => {
                // ema1 > 0 && 0 > ema2
                // ema1 = dataPoint["ema12_1"] - dataPoint["ema24_1"] 
                // ema2 = dataPoint["ema12_2"] - dataPoint["ema24_2"]
                // ---------------------
                // ema1 = 630 - 625 = 5
                // ema2 = 605 - 650 = -45
                // 5 > 0 && 0 > -45 === true

                const notHoldingEmaDecreasing = {
                    "value_1": 630,
                    "value_2": 633,
                    "ema24_1": 625,
                    "ema24_2": 650,
                    "ema12_1": 630,
                    "ema12_2": 605,
                    "stock_holding": false,
                    "buy_point": 575
                }
                expect(conservativeMomentumStrategyEvaluationFunction(notHoldingEmaDecreasing, parseFloat(UPPER_SELL), parseFloat(LOWER_SELL))).toMatch(/HOLD/)
            })

            it("should hold when holding stock and ema is increasing", () => {
                const holdingEmaIncreasingNotDoublePos = {
                    "value_1": 630,
                    "value_2": 632,
                    "ema24_1": 630,
                    "ema24_2": 605,
                    "ema12_1": 625,
                    "ema12_2": 650,
                    "stock_holding": true,
                    "buy_point": 575
                }
                expect(conservativeMomentumStrategyEvaluationFunction(holdingEmaIncreasingNotDoublePos, parseFloat(UPPER_SELL), parseFloat(LOWER_SELL))).toMatch(/HOLD/)
            })
        })
    })
})

describe("Ema returns correct values", () => {
    const goodEMA1 = ema(2685.78, 713.989990234375, 24, 2)
    const goodEMA2 = ema(2685.78, 713.989990234375, 12, 2)
    const goodEMA3 = ema(2685.78, 713.989990234375, 6, 2)

    const goodEMA1U = ema(2685.78, 713.989990234375, 24)
    const goodEMA2U = ema(2685.78, 713.989990234375, 12)
    const goodEMA3U = ema(2685.78, 713.989990234375, 6)

    const badEMA1 = () => ema("2685.78", 713.989990234375, 24, 2)
    const badEMA2 = () => ema(2685.78, NaN, 12, 2)
    const badEMA3 = () => ema(2685.78, 713.989990234375, undefined, 2)
    const badEMA4 = () => ema(2685.78, 713.989990234375, 6, {})

    describe("should validate input", () => {
        it("should not throw an error if smoothing is undefined", () => {
            expect(typeof goodEMA1U === "number" && !isNaN(goodEMA1U)).toBeTruthy()
            expect(typeof goodEMA2U === "number" && !isNaN(goodEMA2U)).toBeTruthy()
            expect(typeof goodEMA3U === "number" && !isNaN(goodEMA3U)).toBeTruthy()
        })
        it("should have a default smoothing of 2 if smoothing is undefined", () => {
            expect(goodEMA1U).toBe(goodEMA1)
            expect(goodEMA2U).toBe(goodEMA2)
            expect(goodEMA3U).toBe(goodEMA3)
        })
        it("should throw an error if prevEma is bad", () => expect(badEMA1).toThrow(Error))
        it("should throw an error if dataPoint is bad", () => expect(badEMA2).toThrow(Error))
        it("should throw an error if days is bad", () => expect(badEMA3).toThrow(Error))
        it("should throw an error if smoothing is bad", () => expect(badEMA4).toThrow(Error))
    })

    describe("should return correct ema values", () => {
        it("should return 2528.0367... for (2685.78, 713.989990234375, 24) input", () => expect(goodEMA1).toBeCloseTo(2528.0367992187503))
        it("should return 2382.4276... for (2685.78, 713.989990234375, 12) input", () => expect(goodEMA2).toBeCloseTo(2382.4276908052884))
        it("should return 2122.4114... for (2685.78, 713.989990234375, 6) input", () => expect(goodEMA3).toBeCloseTo(2122.4114257812503))
    })
})

describe("conservativeMomentumBacktesterFunction should behave correctly", () => {
    describe("The function should validate it's parameters", () => {
        const dataSet = [
            { 'ticker': 'TSLA', 'date': '2022:05:20 00:00:00', 'value': 713.989990234375 },
            { 'ticker': 'TSLA', 'date': '2022:05:23 00:00:00', 'value': 655.02001953125 },
            { 'ticker': 'TSLA', 'date': '2022:05:24 00:00:00', 'value': 653.530029296875 },
            { 'ticker': 'TSLA', 'date': '2022:05:25 00:00:00', 'value': 623.8499755859375 }
        ]
        const badValueDataSet1 = [
            { 'ticker': 'TSLA', 'date': '2022:05:20 00:00:00', 'value': "713.989990234375" },
            { 'ticker': 'TSLA', 'date': '2022:05:23 00:00:00', 'value': "655.02001953125" },
            { 'ticker': 'TSLA', 'date': '2022:05:24 00:00:00', 'value': "653.530029296875" },
            { 'ticker': 'TSLA', 'date': '2022:05:25 00:00:00', 'value': "623.8499755859375" }
        ]
        const badValueDataSet2 = [
            { 'ticker': 'TSLA', 'date': '2022', 'value': "713.989990234375" },
            { 'ticker': 'TSLA', 'date': '2022:05:23 00:00:00', 'value': "655.02001953125" },
            { 'ticker': 'TSLA', 'date': '2022:05:24 00:00:00', 'value': "653.530029296875" },
            { 'ticker': 'TSLA', 'date': '2022', 'value': "623.8499755859375" }
        ]
        const badValueDataSet3 = [
            { 'ticker': 'TSLAAA', 'date': '2022:05:20 00:00:00', 'value': "713.989990234375" },
            { 'ticker': 123, 'date': '2022:05:23 00:00:00', 'value': "655.02001953125" },
            { 'ticker': 'TSLA', 'date': '2022:05:24 00:00:00', 'value': "653.530029296875" },
            { 'ticker': 'TSLA', 'date': '2022:05:25 00:00:00', 'value': NaN }
        ]
        const initSMA24 = 2685.78
        const initSMA12 = 3029.18
        const initiallyHolding = false

        const goodBacktest = () => conservativeMomentumBacktesterFunction(dataSet, initSMA24, initSMA12, initiallyHolding,
            parseFloat(UPPER_SELL), parseFloat(LOWER_SELL))
        const badDatasetValuesBacktest1 = () => conservativeMomentumBacktesterFunction(badValueDataSet1, initSMA24, initSMA12, initiallyHolding,
            parseFloat(UPPER_SELL), parseFloat(LOWER_SELL))
        const badDatasetValuesBacktest2 = () => conservativeMomentumBacktesterFunction(badValueDataSet2, initSMA24, initSMA12, initiallyHolding,
            parseFloat(UPPER_SELL), parseFloat(LOWER_SELL))
        const badDatasetValuesBacktest3 = () => conservativeMomentumBacktesterFunction(badValueDataSet3, initSMA24, initSMA12, initiallyHolding,
            parseFloat(UPPER_SELL), parseFloat(LOWER_SELL))
        const badDatasetBacktest = () => conservativeMomentumBacktesterFunction({}, initSMA24, initSMA12, initiallyHolding,
            parseFloat(UPPER_SELL), parseFloat(LOWER_SELL))
        const badSMABacktest = () => conservativeMomentumBacktesterFunction(dataSet, "initSMA24", initSMA12, initiallyHolding,
            parseFloat(UPPER_SELL), parseFloat(LOWER_SELL))
        const badHoldingBacktest = () => conservativeMomentumBacktesterFunction(dataSet, initSMA24, initSMA12, "initiallyHolding",
            parseFloat(UPPER_SELL), parseFloat(LOWER_SELL))
        const badSellBacktest = () => conservativeMomentumBacktesterFunction(dataSet, initSMA24, initSMA12, initiallyHolding,
            "upperSell", parseFloat(LOWER_SELL))

        describe("should throw an error if the values of the dataset are not of the right type", () => {
            it("should have string type for all values except for the value, which is number", () => {
                expect(badDatasetValuesBacktest1).toThrow(Error)
                expect(badDatasetValuesBacktest2).toThrow(Error)
                expect(badDatasetValuesBacktest3).toThrow(Error)
            })
        })

        it("should not throw an error if the function arguments are correct", () => expect(goodBacktest).not.toThrow(Error))
        it("should throw an error if dataSet is bad", () => expect(badDatasetBacktest).toThrow(Error))
        it("should throw an error if initSMA is bad", () => expect(badSMABacktest).toThrow(Error))
        it("should throw an error if initiallyHolding is bad", () => expect(badHoldingBacktest).toThrow(Error))
        it("should throw an error if Sell is bad", () => expect(badSellBacktest).toThrow(Error))
    })

    describe("The function should return the right backtest for a stock", () => {
        // other input variables
        const initSMA24 = 2685.78
        const initSMA12 = 3029.18
        const initHolding = false

        // input
        const goodInput1 = [
            { 'ticker': 'TSLA', 'date': '2022:05:23 00:00:00', 'value': 655.02001953125 },
            { 'ticker': 'TSLA', 'date': '2022:05:24 00:00:00', 'value': 653.530029296875 },
            { 'ticker': 'TSLA', 'date': '2022:05:25 00:00:00', 'value': 623.8499755859375 },
            { 'ticker': 'TSLA', 'date': '2022:05:26 00:00:00', 'value': 661.4199829101562 },
            { 'ticker': 'TSLA', 'date': '2022:05:27 00:00:00', 'value': 723.25 }
        ] // (TSLA, 1D, 1wk) (as of May 29 2022)

        const goodInput2 = [
            { 'ticker': 'ETH-USD', 'date': '2022:04:30 00:00:00', 'value': 2815.533447265625 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:01 00:00:00', 'value': 2729.994140625 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:02 00:00:00', 'value': 2827.614013671875 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:03 00:00:00', 'value': 2857.15234375 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:04 00:00:00', 'value': 2783.131103515625 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:05 00:00:00', 'value': 2940.2265625 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:06 00:00:00', 'value': 2748.931640625 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:07 00:00:00', 'value': 2694.991943359375 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:08 00:00:00', 'value': 2636.121826171875 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:09 00:00:00', 'value': 2518.50830078125 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:10 00:00:00', 'value': 2242.650390625 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:11 00:00:00', 'value': 2342.754150390625 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:12 00:00:00', 'value': 2072.504638671875 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:13 00:00:00', 'value': 1960.12255859375 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:14 00:00:00', 'value': 2014.2806396484375 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:15 00:00:00', 'value': 2056.18310546875 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:16 00:00:00', 'value': 2145.8369140625 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:17 00:00:00', 'value': 2022.88232421875 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:18 00:00:00', 'value': 2090.4599609375 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:19 00:00:00', 'value': 1916.1495361328125 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:20 00:00:00', 'value': 2018.0001220703125 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:21 00:00:00', 'value': 1961.0179443359375 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:22 00:00:00', 'value': 1974.670654296875 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:23 00:00:00', 'value': 2042.3447265625 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:24 00:00:00', 'value': 1972.390869140625 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:25 00:00:00', 'value': 1978.677001953125 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:26 00:00:00', 'value': 1945.0333251953125 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:27 00:00:00', 'value': 1802.5438232421875 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:28 00:00:00', 'value': 1724.635986328125 },
            { 'ticker': 'ETH-USD', 'date': '2022:05:30 00:00:00', 'value': 1811.2347412109375 }
        ] // (ETH-USD, 1D, 1mo) (as of May 29 2022)

        // output
        const goodOutput1 = [
            { 'ticker': 'TSLA', 'date': '2022:05:23 00:00:00', 'value': 653.530029296875, 'ema24': 2523.3192015625004, 'ema12': 2663.924618389423, 'holding_stock': true, 'current_profitability_multiplier': 1.0, 'position_evaluation': 'BUY', 'position_two_step_evaluation': 'BUY and HOLD' },
            { 'ticker': 'TSLA', 'date': '2022:05:24 00:00:00', 'value': 623.8499755859375, 'ema24': 2373.7360677812508, 'ema12': 2354.6331431444155, 'holding_stock': false, 'current_profitability_multiplier': 0.9545850192333627, 'position_evaluation': 'SELL', 'position_two_step_evaluation': 'SELL and HOLD' }
        ] // (TSLA, 1D, 1wk) (as of May 29 2022)

        const goodOutput2 = [
            { 'ticker': 'ETH-USD', 'date': '2022:04:30 00:00:00', 'value': 2729.994140625, 'ema24': 2696.16027578125, 'ema12': 2996.3112995793267, 'holding_stock': true, 'current_profitability_multiplier': 1.0, 'position_evaluation': 'BUY', 'position_two_step_evaluation': 'BUY and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:01 00:00:00', 'value': 2827.614013671875, 'ema24': 2698.8669849687503, 'ema12': 2955.3394289709686, 'holding_stock': true, 'current_profitability_multiplier': 1.0, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:02 00:00:00', 'value': 2857.15234375, 'ema24': 2709.1667472650006, 'ema12': 2935.6893650788, 'holding_stock': true, 'current_profitability_multiplier': 1.0, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:03 00:00:00', 'value': 2783.131103515625, 'ema24': 2721.0055949838006, 'ema12': 2923.606746412831, 'holding_stock': true, 'current_profitability_multiplier': 1.0, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:04 00:00:00', 'value': 2940.2265625, 'ema24': 2725.975635666347, 'ema12': 2901.99510904403, 'holding_stock': true, 'current_profitability_multiplier': 1.0, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:05 00:00:00', 'value': 2748.931640625, 'ema24': 2743.1157098130393, 'ema12': 2907.8768711141793, 'holding_stock': true, 'current_profitability_multiplier': 1.0, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:06 00:00:00', 'value': 2694.991943359375, 'ema24': 2743.5809842779963, 'ema12': 2883.4237587312286, 'holding_stock': true, 'current_profitability_multiplier': 1.0, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:07 00:00:00', 'value': 2636.121826171875, 'ema24': 2739.6938610045063, 'ema12': 2854.43424867402, 'holding_stock': true, 'current_profitability_multiplier': 1.0, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:08 00:00:00', 'value': 2518.50830078125, 'ema24': 2731.408098217896, 'ema12': 2820.8477221352287, 'holding_stock': false, 'current_profitability_multiplier': 0.9225324931300648, 'position_evaluation': 'SELL', 'position_two_step_evaluation': 'SELL and BUY' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:09 00:00:00', 'value': 2242.650390625, 'ema24': 2714.3761144229647, 'ema12': 2774.3339650038474, 'holding_stock': true, 'current_profitability_multiplier': 0.9225324931300648, 'position_evaluation': 'BUY', 'position_two_step_evaluation': 'BUY and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:10 00:00:00', 'value': 2342.754150390625, 'ema24': 2676.6380565191275, 'ema12': 2692.5364920224865, 'holding_stock': true, 'current_profitability_multiplier': 0.9225324931300648, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:11 00:00:00', 'value': 2072.504638671875, 'ema24': 2649.9273440288475, 'ema12': 2638.723824079123, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'SELL', 'position_two_step_evaluation': 'SELL and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:12 00:00:00', 'value': 1960.12255859375, 'ema24': 2603.73352760029, 'ema12': 2551.613180170316, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:13 00:00:00', 'value': 2014.2806396484375, 'ema24': 2552.244650079767, 'ema12': 2460.6146230046907, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:14 00:00:00', 'value': 2056.18310546875, 'ema24': 2509.207529245261, 'ema12': 2391.947856334498, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:15 00:00:00', 'value': 2145.8369140625, 'ema24': 2472.9655753431402, 'ema12': 2340.2917408166904, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:16 00:00:00', 'value': 2022.88232421875, 'ema24': 2446.795282440689, 'ema12': 2310.375613623738, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:17 00:00:00', 'value': 2090.4599609375, 'ema24': 2412.8822457829338, 'ema12': 2266.1458767922013, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:18 00:00:00', 'value': 1916.1495361328125, 'ema24': 2387.0884629952993, 'ema12': 2239.1172743530165, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:19 00:00:00', 'value': 2018.0001220703125, 'ema24': 2349.413348846301, 'ema12': 2189.4299300114467, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:20 00:00:00', 'value': 1961.0179443359375, 'ema24': 2322.900290704222, 'ema12': 2163.056113405118, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:21 00:00:00', 'value': 1974.670654296875, 'ema24': 2293.949702994759, 'ema12': 2131.9733181637057, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:22 00:00:00', 'value': 2042.3447265625, 'ema24': 2268.4073790989282, 'ema12': 2107.7729083380395, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:23 00:00:00', 'value': 1972.390869140625, 'ema24': 2250.322366896014, 'ema12': 2097.7070342187258, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:24 00:00:00', 'value': 1978.677001953125, 'ema24': 2228.0878470755833, 'ema12': 2078.4276242067103, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:25 00:00:00', 'value': 1945.0333251953125, 'ema24': 2208.134979465787, 'ema12': 2063.0813746292356, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
            { 'ticker': 'ETH-USD', 'date': '2022:05:26 00:00:00', 'value': 1802.5438232421875, 'ema24': 2187.0868471241492, 'ema12': 2044.920136254786, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' }
        ] // (ETH-USD, 1D, 1mo) (as of May 29 2022)

        const badOutput1 = [
            { 'ticker': 'TSLAA', 'date': '2022:05:23 00:', 'value': "653.530029296875", 'ema24': 2523.3192015625004, 'ema12': 2663.924618389423, 'holding_stock': true, 'current_profitability_multiplier': 1.0, 'position_evaluation': 'BUY', 'position_two_step_evaluation': 'BUY and HOLD' },
            { 'ticker': 'TSLAA', 'date': '2022:05:24 00:00:00', 'value': 623.8499755859375, 'ema24': 2373.7360677812508, 'ema12': 2354.6331431444155, 'holding_stock': "false", 'current_profitability_multiplier': 0.9545850192333627, 'position_evaluation': 'SELL', 'position_two_step_evaluation': 'SELL and HOLD' }
        ]

        const backtested = conservativeMomentumBacktesterFunction(
            goodInput1, initSMA24, initSMA12, initHolding, parseFloat(UPPER_SELL), parseFloat(LOWER_SELL))
        const backtested2 = conservativeMomentumBacktesterFunction(
            goodInput2, initSMA24, initSMA12, initHolding, parseFloat(UPPER_SELL), parseFloat(LOWER_SELL))

        it("should match the test case array length for (TSLA, 1D, 1wk) (as of May 29 2022)", () => expect(backtested.length).toBe(goodOutput1.length))
        it("should match test case for API data (TSLA, 1D, 1wk) (as of May 29 2022)", () => {
            expect(backtested).toEqual(goodOutput1)
            expect(backtested).not.toEqual(badOutput1)
        })
        it("should match the test case array length for (ETH-USD, 1D, 1mo) (as of May 29 2022)", () => expect(backtested2.length).toBe(goodOutput2.length))
        it("should match test case for API data (ETH-USD, 1D, 1mo) (as of May 29 2022)", () => {
            expect(backtested2).toEqual(goodOutput2)
            expect(backtested2).not.toEqual(badOutput1)
        })
    })

    describe("The function should be performant", () => {
        it("should not take more than 100ms to complete", () => {
            // other input variables
            const initSMA24 = 2685.78
            const initSMA12 = 3029.18
            const initHolding = false
            
            // input
            const goodInput1 = [
                { 'ticker': 'TSLA', 'date': '2022:05:23 00:00:00', 'value': 655.02001953125 },
                { 'ticker': 'TSLA', 'date': '2022:05:24 00:00:00', 'value': 653.530029296875 },
                { 'ticker': 'TSLA', 'date': '2022:05:25 00:00:00', 'value': 623.8499755859375 },
                { 'ticker': 'TSLA', 'date': '2022:05:26 00:00:00', 'value': 661.4199829101562 },
                { 'ticker': 'TSLA', 'date': '2022:05:27 00:00:00', 'value': 723.25 }
            ] // (TSLA, 1D, 1wk) (as of May 29 2022)

            const t0 = performance.now()
            conservativeMomentumBacktesterFunction(goodInput1, initSMA24, initSMA12, initHolding, parseFloat(UPPER_SELL), parseFloat(LOWER_SELL))
            const t1 = performance.now()
            expect(t1 - t0).toBeLessThan(100)
        })
    })
})
