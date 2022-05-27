// This file contains the code needed to backtest stocks
import { getChartData } from '../api/chartData';
import { areSetsEqual } from '../data-transformers/helpers';
import moment from 'moment';

export const getSmaDataPoint = async (ticker, date, days) => {
    /*
    :param ticker (str): Stock Ticker.
    :param date (str): Date querying SMA.
    :param days (int): SMA_days(day). Example: SMA_50("ETH-USD", "2022:05:04 00:00:00")
    :return: A dictionary of the SMA value.
    */
    const regexResult = /[0-9]+:(0?[1-9]|[1][0-2]):(0?[1-9]|[12][0-9]|3[01])\s[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?/i.test(date);
    const period1 = moment(date, "YYYY:MM:DD HH:mm:ss").subtract(days, 'days').unix();
    const period2 = moment(date, "YYYY:MM:DD HH:mm:ss").unix();
    const form = { ticker, interval: "1d", period: "1y", period1, period2 };

    if (typeof ticker !== 'string' || ticker.length === 0 || ticker.length > 4) { throw new Error("Ticker entered is invalid in getSmaDataPoint function.")}
    if (typeof date !== 'string' || regexResult === false) { throw new Error("Date entered is invalid in getSmaDataPoint function.")}
    if (typeof days !== 'number' || isNaN(days)) { throw new Error("Days entered is invalid in getSmaDataPoint function.")}
    if (period1 === period2) { throw new Error("Period1 and Period2 are the same in getSmaDataPoint function.")}

    try {
        const response = await getChartData(form);
        const data = response.data.chart.result[0].indicators.adjclose[0].adjclose;
        const sma = data.slice(data.length - days, data.length).reduce((acc, cur) => acc + cur) / days;
        return { "ticker": ticker, "date": date, "sma": sma };
    } catch (err) { err }
}

export const conservativeMomentumStrategy = (dataPoint, upperSell, lowerSell) => {
    const validKeys = ["value_1", "value_2", "ema24_1", "ema24_2", "ema12_1", "ema12_2", "stock_holding", "buy_point"];
    const allValues = Object.values(dataPoint);
    const allNumericValues = allValues.filter((value) => {return typeof value === "number"});
    const allBoolValues = allValues.filter((value) => {return typeof value === "boolean"});
    if (!areSetsEqual(new Set(Object.keys(dataPoint)) , new Set(validKeys))){
        throw new Error("Invalid keys entered for conservativeMomentumStrategy");
    }
    if ((allNumericValues.length !== allValues.length - 1) || (allBoolValues.length !== 1) || typeof dataPoint["stock_holding"] !== "boolean"){
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
    
    if (!holding){
        if (emaDoublePositive){
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
    } else if (holding){
        if (v2 >= top || v2 <= bottom) {
            return SELL;
        } else if (emaDecreasing) {
            return SELL;
        } else if (emaIncreasing) {
            return HOLD;
        } else if (emaDoubleNegative){
            return SELL;
        } else {
            return HOLD;
        }
    }
    else {
        return HOLD;
    }
}