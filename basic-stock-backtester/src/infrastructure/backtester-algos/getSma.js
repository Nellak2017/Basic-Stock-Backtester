import { getChartData } from '../api/chartData'
import { DATE_FORMAT } from '../content/constants'
import moment from 'moment'

export const getSmaDataPoint = async (ticker, date, days) => {
    /*
    :param ticker (str): Stock Ticker.
    :param date (str): Date querying SMA.
    :param days (int): SMA_days(day). Example: SMA_50("ETH-USD", "2022:05:04 00:00:00")
    :return: A dictionary of the SMA value.
    */
    const regexResult = /[0-9]+:(0?[1-9]|[1][0-2]):(0?[1-9]|[12][0-9]|3[01])\s[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?/i.test(date)
    const period1 = moment(date, DATE_FORMAT).subtract(days, 'days').unix() // convert date to unix, so that API understands it
    const period2 = moment(date, DATE_FORMAT).unix() // convert date to unix, so that API understands it
    const form = { ticker, interval: "1d", period: "1y", period1, period2 }

    if (typeof ticker !== 'string' || ticker.length === 0 || ticker.length > 4) throw new Error(`Ticker entered is invalid in getSmaDataPoint function. Got: ${ticker}`)
    if (typeof date !== 'string' || regexResult === false) throw new Error(`Date entered is invalid in getSmaDataPoint function. Got: ${date}`)
    if (typeof days !== 'number' || isNaN(days)) throw new Error(`Days entered is invalid in getSmaDataPoint function. Got: ${days}`)
    if (period1 === period2) throw new Error(`Period1 and Period2 are the same in getSmaDataPoint function. Got: period1 = ${period1}, period2 = ${period2}`)

    try {
        const response = await getChartData(form)
        const data = response.data.chart.result[0].indicators.adjclose[0].adjclose
        const sma = data.slice(data.length - days, data.length).reduce((acc, cur) => acc + cur) / days
        return { "ticker": ticker, "date": date, "sma": sma }
    } catch (err) { err }
}