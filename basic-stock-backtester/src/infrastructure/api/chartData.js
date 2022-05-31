import axios from 'axios'
import axiosRetry from 'axios-retry'
import { DEFAULT_RETRIES, MATCH_TICKER } from '../content/constants'

// Call the API to get the Chart data.
export const getChartData = async (data) => {
    // Axios Retry
    // ----------------
    axiosRetry(axios, { retries: DEFAULT_RETRIES, retryDelay: axiosRetry.exponentialDelay })

    // Variables
    // ----------------
    const { ticker, interval, period } = data
    const periodOne = data["period1"]
    const periodTwo = data["period2"]
    const URL = `https://yh-finance.p.rapidapi.com/stock/v3/get-chart`

    // Validate Input
    // ----------------
    if (!MATCH_TICKER.test(ticker) || typeof ticker !== "string") { throw new Error(`Ticker must be a string with a valid format in getChartData. Ticker: ${ticker}`)}

    // Fetch Data and Retry if you fail to fetch it
    // ----------------
    return await axios.get(URL, {
        params: {
            interval: interval,
            symbol: ticker,
            range: period,
            period1: periodOne,
            period2: periodTwo,
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
}
