// This file contains the code needed to backtest stocks
import { areSetsEqual } from '../data-transformers/helpers';

export const conservativeMomentumStrategyEvaluationFunction = (dataPoint, upperSell, lowerSell) => {
    // Asserting input is valid 
    // ------------------------
    const validKeys = ["value_1", "value_2", "ema24_1", "ema24_2", "ema12_1", "ema12_2", "stock_holding", "buy_point"];
    const allValues = Object.values(dataPoint);
    const allNumericValues = allValues.filter((value) => { return typeof value === "number" });
    const allBoolValues = allValues.filter((value) => { return typeof value === "boolean" });
    if (!areSetsEqual(new Set(Object.keys(dataPoint)), new Set(validKeys))) {
        throw new Error("Invalid keys entered for conservativeMomentumStrategy");
    }
    if ((allNumericValues.length !== allValues.length - 1) || (allBoolValues.length !== 1) || typeof dataPoint["stock_holding"] !== "boolean") {
        throw new Error("Invalid value types provided for conservativeMomentumStrategy");
    }
    if (typeof upperSell !== "number" || isNaN(upperSell)) {
        throw new Error("upperSell variable is not a valid number for conservativeMomentumStrategy");
    }
    if (typeof lowerSell !== "number" || isNaN(lowerSell)) {
        throw new Error("lowerSell variable is not a valid number for conservativeMomentumStrategy");
    }

    // Variables defined
    // ------------------------
    const BUY = "BUY";
    const SELL = "SELL";
    const HOLD = "HOLD";
    const holding = dataPoint["stock_holding"];
    const v2 = dataPoint["value_2"];
    const top = dataPoint["buy_point"] * upperSell;
    const bottom = dataPoint["buy_point"] * lowerSell;
    const ema1 = dataPoint["ema12_1"] - dataPoint["ema24_1"];
    const ema2 = dataPoint["ema12_2"] - dataPoint["ema24_2"];
    const emaIncreasing = ema1 < 0 && 0 < ema2;
    const emaDecreasing = ema1 > 0 && 0 > ema2;
    const emaDoublePositive = ema1 > 0 && ema2 > 0 && !emaDecreasing && !emaIncreasing;
    const emaDoubleNegative = ema1 < 0 && ema2 < 0 && !emaDecreasing && !emaIncreasing;

    // Calculating the evaluation function for momentum strategy
    // ------------------------
    if (!holding) {
        if (emaDoublePositive) {
            return BUY;
        } else if (emaDecreasing) {
            return HOLD;
        } else if (emaIncreasing) {
            return BUY;
        } else if (emaDoubleNegative) {
            return HOLD;
        } else {
            return HOLD;
        }
    } else if (holding) {
        if (v2 >= top || v2 <= bottom) {
            return SELL;
        } else if (emaDecreasing) {
            return SELL;
        } else if (emaIncreasing) {
            return HOLD;
        } else if (emaDoubleNegative) {
            return SELL;
        } else {
            return HOLD;
        }
    }
    else {
        return HOLD;
    }
}

export const ema = (prevEma, dataPoint, days, smoothing) => {
    // Asserting input is valid and setting default values for parameters
    // ------------------------
    if (smoothing === undefined) { smoothing = 2 }
    if (typeof prevEma !== "number" || isNaN(prevEma)) { throw new Error("Entered Previous Ema is not a number. Enter a valid number to compute ema.") }
    if (typeof dataPoint !== "number" || isNaN(dataPoint)) { throw new Error("Entered Data Point for ema function is not a number. Enter a valid number to compute ema.") }
    if (typeof days !== "number" || isNaN(days)) { throw new Error("Entered days for ema function is not a number. Enter a valid number to compute ema.") }
    if (typeof smoothing !== "number" || isNaN(smoothing)) { throw new Error("Entered smoothing for ema function is not a number. Enter a valid number to compute ema.") }

    // Variables defined
    // ------------------------
    const multiplier = (smoothing / (1 + days))

    // Return Exponential Moving Average
    // ------------------------
    return dataPoint * multiplier + prevEma * (1 - multiplier)
}

// @ Todo: Refactor to allow for different evaluation functions to be passed in as a parameter, for greater extensibility
export const conservativeMomentumBacktesterFunction = (dataSet, initSMA24, initSMA12, initiallyHolding,
    upperSell, lowerSell) => {
    // Asserting input is valid
    // ------------------------
    if (dataSet === null || typeof dataSet === "undefined") throw new Error(`dataSet is ${dataSet} inside backtester function`)
    if (!Array.isArray(dataSet)) throw new Error(`Expected dataSet to be an Array, got ${typeof dataSet}`)
    const properDataSetKeys = new Set(["ticker", "date", "value"]);
    const everyDictsKeys = dataSet.map(dict => Object.keys(dict));

    if (!everyDictsKeys.every((arr) => areSetsEqual(properDataSetKeys, new Set(arr)))) { throw new Error(`dataSet entered to backtester is bad`) }
    if (typeof initSMA24 !== "number" || typeof initSMA12 !== "number" || isNaN(initSMA24) || isNaN(initSMA12)) { 
        console.error(initSMA12)
        throw new Error(`initialSMA entered to backtester is bad: initSMA12: ${initSMA12} initSMA24: ${initSMA24}`) 
    }
    if (typeof initiallyHolding !== "boolean") { throw new Error(`initiallyHolding entered to backtester is bad: ${initiallyHolding}`) }
    if (typeof upperSell !== "number" || typeof lowerSell !== "number" || isNaN(upperSell) || isNaN(lowerSell)) { throw new Error(`upper/lower sell entered to backtester is bad: upperSell: ${upperSell} , lowerSell: ${lowerSell}`) }

    // Variables defined
    // ------------------------
    const BUY = "BUY"
    const SELL = "SELL"
    const HOLD = "HOLD"
    const BH = "BUY and HOLD"
    const SH = "SELL and HOLD"
    const SB = "SELL and BUY"
    const HH = "HOLD and HOLD"
    const value = "value"
    let nextPositionEvaluation = HOLD
    let positionEvaluation = HOLD
    let positionTwoStepEvaluation = HH
    let store = []
    let buyPoint = dataSet[1][value]
    let sellPoint = dataSet[1][value]
    let profitabilityMultiplier = 1.0
    let holding = initiallyHolding
    let EMA24_1 = initSMA24
    let EMA12_1 = initSMA12

    // Calculating the backtested stock values client side (Tried Server side, but it was inconsistent)
    // ------------------------
    for (let dataIndex = 0; dataIndex < dataSet.length - 3; dataIndex++) {
        const value1 = dataSet[dataIndex + 0][value]
        const value2 = dataSet[dataIndex + 1][value]
        const value3 = dataSet[dataIndex + 2][value]
        const value4 = dataSet[dataIndex + 3][value]

        // calculate indicators using provided indicator function
        let EMA24_2 = ema(EMA24_1, value1, 24)  // omitted smoothing, as the function handles it itself
        let EMA12_2 = ema(EMA12_1, value1, 12)


        // compose evaluation DTO using indicators
        const evalDTO = {
            "value_1": value1,
            "value_2": value2,
            "ema24_1": EMA24_1,
            "ema24_2": EMA24_2,
            "ema12_1": EMA12_1,
            "ema12_2": EMA12_2,
            "stock_holding": holding,
            "buy_point": buyPoint
        }

        // evaluate this position, passing in dto and store data
        const evalPos = conservativeMomentumStrategyEvaluationFunction
        const positionEvaluation = evalPos(evalDTO, upperSell, lowerSell)
        if (![BUY, SELL, HOLD].includes(positionEvaluation)) { throw new Error("The Evaluation Function Returned an unexpected value.") }

        EMA24_1 = EMA24_2
        EMA12_1 = EMA12_2
        EMA24_2 = ema(EMA24_2, value1, 24)
        EMA12_2 = ema(EMA12_2, value1, 12)

        // update related variables for the store
        if (positionEvaluation === BUY) {
            buyPoint = value2
            holding = true
        } else if (positionEvaluation === SELL) {
            sellPoint = value2
            profitabilityMultiplier *= (sellPoint / buyPoint)
            holding = false
        } 

        const evalDTONext = {
            "value_1": value3,
            "value_2": value4,
            "ema24_1": EMA24_1,
            "ema24_2": EMA24_2,
            "ema12_1": EMA12_1,
            "ema12_2": EMA12_2,
            "stock_holding": holding,
            "buy_point": buyPoint
        }

        nextPositionEvaluation = evalPos(evalDTONext, upperSell, lowerSell)
        if (![BUY, SELL, HOLD].includes(nextPositionEvaluation)) { throw new Error("The 'Next' Evaluation Function Returned an unexpected value.") }

        if (positionEvaluation === BUY) { positionTwoStepEvaluation = BH }
        else if (positionEvaluation == SELL && nextPositionEvaluation == HOLD) { positionTwoStepEvaluation = SH }
        else if (positionEvaluation == SELL && nextPositionEvaluation == BUY)  { positionTwoStepEvaluation = SB }
        else { positionTwoStepEvaluation = HH }

        // update the store
        store.push({
            "ticker": dataSet[dataIndex]["ticker"],
            "date": dataSet[dataIndex]["date"],
            "value": value2,
            "ema24": EMA24_1,
            "ema12": EMA12_1,
            "holding_stock": holding,
            "current_profitability_multiplier": profitabilityMultiplier,
            "position_evaluation": positionEvaluation,
            "position_two_step_evaluation": positionTwoStepEvaluation
        })
    }

return store;
}