// This file contains the code needed to backtest stocks
import { getChartData } from '../api/chartData';
import moment from 'moment';

export const getSmaDataPoint = async (ticker, date, days) => {
    /*
    :param ticker (str): Stock Ticker.
    :param date (str): Date querying SMA.
    :param days (int): SMA_days(day). Example: SMA_50("ETH-USD", "2022:05:04 00:00:00")
    :return: A dictionary of the SMA value.
    */
    const regex = /[0-9]+:(0?[1-9]|[1][0-2]):(0?[1-9]|[12][0-9]|3[01])\s[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?/i;
    const regexResult = regex.test(date);
    if (typeof ticker !== 'string') {
        throw new Error("Ticker entered is invalid in getSmaDataPoint function.");
    }
    if (typeof date !== 'string' || regexResult === false) {
        throw new Error("Date entered is invalid in getSmaDataPoint function.");
    }
    if (typeof days !== 'number' || isNaN(days)) {
        throw new Error("Days entered is invalid in getSmaDataPoint function.");
    }
    const theDate = moment(date, "YYYY:MM:DD HH:mm:ss");
    const newDate = moment(date, "YYYY:MM:DD HH:mm:ss").subtract(days, 'days');

    const period1 = newDate.unix();
    const period2 = theDate.unix();

    if (period1 === period2){
        throw new Error("Period1 and Period2 are the same in getSmaDataPoint function.")
    }

    const form = { ticker: ticker, interval: "1d", period: "1y", period1: period1, period2: period2 };

    

    const returnVal = getChartData(
        form, 
        (res) => {
            const data = res.data.chart.result[0].indicators.adjclose[0].adjclose;
            const lastN = data.slice(data.length - days, data.length);
            const len = lastN.length;
            const sum = lastN.reduce((acc,cur) => acc + cur);
            const sma = sum / len;

            console.log({ "ticker": ticker, "date": date, "sma": sma })
            return { "ticker": ticker, "date": date, "sma": sma };
        },
        (err) => {
            console.error(err)
            return err;
        }
    );
    return typeof returnVal;
}