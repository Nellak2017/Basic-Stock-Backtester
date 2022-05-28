import axios from 'axios';
import axiosRetry from 'axios-retry';
import { DEFAULT_RETRIES } from '../content/constants';

// Call the API to get the Chart data. Pass it through the data transformer and return it to the caller.
export const getChartData = async (data) => {
    const { ticker, interval, period } = data;

    const periodOne = data["period1"];
    const periodTwo = data["period2"];

    if (typeof ticker !== "string") { throw new Error("Ticker must be a string")}

    axiosRetry(axios, { retries: DEFAULT_RETRIES, retryDelay: axiosRetry.exponentialDelay })
    const URL = `https://yh-finance.p.rapidapi.com/stock/v3/get-chart`;
    const request = await axios.get(URL, {
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
        /*
        .then(response => {
            if (res != null) {
                res(response)
            }
        })
        .catch(error => {
            if (err != null) {
                err(error)
            }
        })
        
        .then(() => {
            console.log(
`                 interval: ${interval}
                 symbol: ${ticker}
                 range: ${period}
                 period1: ${periodOne}
                 period2: ${periodTwo}
                 typeOf: ${ request}`);
        })
        */
       return request;
}
