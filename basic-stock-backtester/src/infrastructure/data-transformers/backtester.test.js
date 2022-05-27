// Step 1 in mocking, import the modules you need
import axios from 'axios';
import {
    getSmaDataPoint,
    conservativeMomentumStrategy
} from '../data-transformers/backtester.js';
import { areSetsEqual } from '../data-transformers/helpers.js';

// Step 2 in mocking, mock the module.
jest.mock('axios'); // Replaces all modules inside to do nothing and return undefined

// Step 3 in mocking, mock the return value of the mocked function. If "mockResolvedValue", it lets you use it multiple times.
axios.get.mockResolvedValue({
    "data": {
        "chart": {
            "result": [
                {
                    "indicators": {
                        "adjclose": [
                            {
                                "adjclose": [619.1300048828125, 630.8499755859375, 625.219970703125, 623.9000244140625, 605.1199951171875, 572.8400268554688, 599.0499877929688, 605.1300048828125, 603.5900268554688, 598.780029296875, 610.1199951171875, 609.8900146484375, 617.6900024414062, 599.3599853515625, 604.8699951171875, 616.5999755859375, 623.3099975585938, 620.8300170898438, 623.7100219726562, 656.5700073242188, 679.8200073242188, 671.8699951171875, 688.719970703125, 680.760009765625, 679.7000122070312, 677.9199829101562, 678.9000244140625, 659.5800170898438, 644.6500244140625, 652.8099975585938, 656.9500122070312, 685.7000122070312, 668.5399780273438, 653.3800048828125, 650.5999755859375, 644.219970703125, 646.219970703125, 660.5, 655.2899780273438, 649.260009765625, 643.3800048828125, 657.6199951171875, 644.780029296875, 646.97998046875, 677.3499755859375, 687.2000122070312, 709.6699829101562, 709.739990234375, 710.9199829101562, 714.6300048828125, 699.0999755859375, 713.760009765625, 709.989990234375, 707.8200073242188, 722.25, 717.1699829101562, 686.1699829101562, 665.7100219726562, 688.989990234375, 673.469970703125, 680.260009765625, 706.2999877929688, 708.489990234375, 711.2000122070312, 701.1599731445312, 711.9199829101562, 730.9099731445312, 735.719970703125, 734.0900268554688, 732.3900146484375, 733.5700073242188, 752.9199829101562, 753.8699951171875, 754.8599853515625, 736.27001953125, 743.0, 744.489990234375, 755.8300170898438, 756.989990234375, 759.489990234375, 730.1699829101562, 739.3800048828125, 751.9400024414062, 753.6400146484375, 774.3900146484375, 791.3599853515625, 777.5599975585938, 781.3099975585938, 775.47998046875, 775.219970703125, 781.530029296875, 780.5900268554688, 782.75, 793.6099853515625, 785.489990234375, 791.9400024414062, 805.719970703125, 811.0800170898438, 818.3200073242188, 843.030029296875]
                            }
                        ]
                    }
                }
            ]
        }
    }
});

describe("getSmaDataPoint should behave correctly", () => {

    describe("The function should validate it's parameters", () => {
        // See also: https://github.com/facebook/jest/blob/main/examples/async/__tests__/user.test.js
        // See also: https://jestjs.io/docs/tutorial-async#rejects

        const badTicker = () => getSmaDataPoint(1, "2022:05:04 00:00:00", 24);
        const badDate = () => getSmaDataPoint("TSLA", "2022:05:04 ", 12);
        const badDays = () => getSmaDataPoint("TSLA", "2022:05:04 00:00:00", "12");

        it("should throw an error if ticker is not a string", async () => {
            expect.assertions(1);
            return badTicker().catch(e =>
                expect(e instanceof Error).toBeTruthy()
            );
        })

        it("should throw an error if date is not a string in the format expected", async () => {
            expect.assertions(1);
            return badDate().catch(e =>
                expect(e instanceof Error).toBeTruthy()
            );
        })

        it("should throw an error if days is not an integer", async () => {
            expect.assertions(1);
            return badDays().catch(e =>
                expect(e instanceof Error).toBeTruthy()
            );
        })
    })

    describe("The function should return an object with a specific format", () => {
        // See also: https://github.com/facebook/jest/blob/main/examples/async/__tests__/user.test.js
        const goodKeys = () => getSmaDataPoint("TSLA", "2022:05:04 00:00:00", 24);
        const expectedKeys = new Set(["ticker", "date", "sma"]);

        it("should have only the keys expected", async () => {
            expect.assertions(1);
            const data = await goodKeys();
            expect(areSetsEqual(new Set(Object.keys(data)), expectedKeys)).toBeTruthy();
        })

        describe("should have values that are the right type and format", () => {
            it("should have valid ticker", async () => {
                expect.assertions(1);
                const data = await goodKeys();
                const ticker = data["ticker"];
                expect(typeof ticker === 'string' || ticker instanceof String && ticker.length <= 4 && ticker.length > 0).toBeTruthy();
            })

            it("should have valid date", async () => {
                expect.assertions(2);
                const data = await goodKeys();
                const date = data["date"];
                expect(typeof date === 'string' || date instanceof String).toBeTruthy();
                expect(date).toMatch(/[0-9]+:(0?[1-9]|[1][0-2]):(0?[1-9]|[12][0-9]|3[01])\s[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?/);
            })

            it("should have valid sma", async () => {
                expect.assertions(1);
                const data = await goodKeys();
                const sma = data["sma"];
                expect(typeof sma === 'number' && !isNaN(sma)).toBeTruthy();
            })
        })
    })

    describe("The function should return the average for the stock given the interval and date", () => {

        const sma24 = () => getSmaDataPoint("TSLA", "2022:05:04 00:00:00", 24);
        const sma12 = () => getSmaDataPoint("TSLA", "2022:05:04 00:00:00", 12);

        const sma24AvgValue = 777.555;
        const sma12AvgValue = 795.397;

        it("should have correct SMA 24 for mocked API response", async () => {
            expect.assertions(1);
            const data = await sma24();
            const sma = data["sma"];
            expect(sma).toBeCloseTo(sma24AvgValue);
        })
        it("should have correct SMA 12 for mocked API response", async () => {
            expect.assertions(1);
            const data = await sma12();
            const sma = data["sma"];
            expect(sma).toBeCloseTo(sma12AvgValue);
        })
    })

})

describe("conservativeMomentumStrategy should behave correctly", () => {
    const dataPoint = {
        "value_1": 630,
        "value_2": 632,
        "ema24_1": 600,
        "ema24_2": 605,
        "ema12_1": 650,
        "ema12_2": 625,
        "stock_holding": true,
        "buy_point": 575
    };
    const badBuyDataPoint = {
        "value_1": 630,
        "value_2": 632,
        "ema24_1": 600,
        "ema24_2": 605,
        "ema12_1": 650,
        "ema12_2": 625,
        "stock_holding": true,
        "buy_point": "575"
    };
    const upperSell = 1.1;
    const lowerSell = .95;
    const goodStrategy = () => conservativeMomentumStrategy(dataPoint, upperSell, lowerSell);
    const badDataPoint = () => conservativeMomentumStrategy([], upperSell, lowerSell);
    const invalidDataPoint = () => conservativeMomentumStrategy(badBuyDataPoint, upperSell, lowerSell);
    const badUpperSell = () => conservativeMomentumStrategy(dataPoint, "123", lowerSell);
    const badLowerSell = () => conservativeMomentumStrategy(dataPoint, upperSell, "123");

    describe("The function should validate it's parameters", () => {

        it("should throw an error if dataPoint has invalid keys", () => {
            expect(badDataPoint).toThrow(Error);
        })

        it("should throw an error if the values of dataPoint are not numbers, execept for stock_holding", () => {
            expect(invalidDataPoint).toThrow(Error);
        })

        it("should throw an error if given a bad upperSell", () => {
            expect(badUpperSell).toThrow(Error);
        })

        it("should throw an error if given a bad lowerSell", () => {
            expect(badLowerSell).toThrow(Error);
        })

        it("should not throw an error if given a valid input", () => {
            expect(goodStrategy).not.toThrow(Error);
        })

    });

    describe("The function should return an evaulation string that is one of only a few enum values", () => {
        it("should have a return value in the set {'BUY','SELL','HOLD'}", () => {
            expect(goodStrategy()).toMatch(/BUY|SELL|HOLD/)
        })
    });

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
            };
            expect(conservativeMomentumStrategy(notHoldingEmaIncreasingNotDoublePos, upperSell, lowerSell)).toMatch(/BUY/);
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
            };
            expect(conservativeMomentumStrategy(notHoldingEmaIncreasingDoublePos, upperSell, lowerSell)).toMatch(/BUY/);
        })

        it("should return SELL when holding and v2 >= top", () => {
            // value 2 > upperSell * buy_point === 633 > 632.5
            const HoldingAndV2MoreThanTop = {
                "value_1": 630,
                "value_2": 633,
                "ema24_1": 630,
                "ema24_2": 605,
                "ema12_1": 625,
                "ema12_2": 650,
                "stock_holding": true,
                "buy_point": 575
            };
            expect(conservativeMomentumStrategy(HoldingAndV2MoreThanTop, upperSell, lowerSell)).toMatch(/SELL/);
        })

        it("should return SELL when holding and v2 <= bottom", () => {
            // value 2 < lowerSell * buy_point ===  545 < 546.25
            const HoldingAndV2LessThanBottom = {
                "value_1": 630,
                "value_2": 545,
                "ema24_1": 630,
                "ema24_2": 605,
                "ema12_1": 625,
                "ema12_2": 650,
                "stock_holding": true,
                "buy_point": 575
            };
            expect(conservativeMomentumStrategy(HoldingAndV2LessThanBottom, upperSell, lowerSell)).toMatch(/SELL/);
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
            };
            expect(conservativeMomentumStrategy(HoldingAndV2EmaDecreasing, upperSell, lowerSell)).toMatch(/SELL/);
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
            };
            expect(conservativeMomentumStrategy(HoldingAndEmaDoubleNegative, upperSell, lowerSell)).toMatch(/SELL/);
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
                };
                expect(conservativeMomentumStrategy(notHoldingEmaDoubleNegative, upperSell, lowerSell)).toMatch(/HOLD/);
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
                };
                expect(conservativeMomentumStrategy(notHoldingEmaDecreasing, upperSell, lowerSell)).toMatch(/HOLD/);
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
                };
                expect(conservativeMomentumStrategy(holdingEmaIncreasingNotDoublePos, upperSell, lowerSell)).toMatch(/HOLD/);
            })
        })
    });
})