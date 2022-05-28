// This file contains the code needed to backtest stocks
import { areSetsEqual } from '../data-transformers/helpers';

export const conservativeMomentumStrategyEvaluationFunction = (dataPoint, upperSell, lowerSell) => {
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

export const conservativeMomentumBacktesterFunction = (dataSet, initSMA24, initSMA12, initiallyHolding,
    upperSell, lowerSell) => {
        const properDataSetKeys = new Set(["ticker", "date", "value"]);
        const everyDictsKeys = dataSet.map(dict => Object.keys(dict));

        if (!everyDictsKeys.every((arr) => areSetsEqual(properDataSetKeys, new Set(arr)))) {
            throw new Error("dataSet entered to backtester is bad")
        }
        if (typeof initSMA24 !== "number" || typeof initSMA12 !== "number" || isNaN(initSMA24) || isNaN(initSMA12)) {
            throw new Error("initialSMA entered to backtester is bad")
        }
        if (typeof initiallyHolding !== "boolean") {
            throw new Error("initiallyHolding entered to backtester is bad")
        }
        if (typeof upperSell !== "number" || typeof lowerSell !== "number" || isNaN(upperSell) || isNaN(lowerSell)) {
            throw new Error("upper/lower sell entered to backtester is bad")
        }
        
        return {};
}