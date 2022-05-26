import axios from 'axios';
import axiosRetry from 'axios-retry';
import { DEFAULT_RETRIES } from '../content/constants';

// Call the API to get the Chart data. Pass it through the data transformer and return it to the caller.
export const getChartData = (data, res, err) => {
    const { ticker, interval, period } = data;

    const periodOne = data["period1"];
    const periodTwo = data["period2"];

    axiosRetry(axios, { retries: DEFAULT_RETRIES, retryDelay: axiosRetry.exponentialDelay })
    const URL = `https://yh-finance.p.rapidapi.com/stock/v3/get-chart`;
    const request = axios.get(URL, {
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
            'X-RapidAPI-Key': '4a765f28f0msh2483c1d87434773p1bd624jsn49890b158cb9'
        }, timeout: 4000
    })
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
}
