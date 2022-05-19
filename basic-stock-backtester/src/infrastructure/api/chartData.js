import axios from 'axios';
// Call the API to get the Chart data. Pass it through the data transformer and return it to the caller.

// 1. Call the API to get the data
// 2. Pass it through the data transformer
// 3. Return that transformed data to the caller

// Todo: Clean this up, by simplifying the props passed
// Todo: Improve error handling
// Todo: remove unused .then
export const getChartData = (data, res, err) => {
        const {ticker, interval, period, upperSell, lowerSell, initHolding,
            strategy, lowerIndicator, upperIndicator} = data;
        const URL = `http://localhost:5000/${strategy}?ticker=${ticker}&interval=${interval}&period=${period}&upperSell=${upperSell}&lowerSell=${lowerSell}&initHolding=${initHolding}&lowerIndicator=${lowerIndicator}&upperIndicator=${upperIndicator}`
        axios.get(URL, {
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => {
            if(res != null) {
                res(response)
            }
        })
        .catch( error => {
            if(err != null) {
                err(error)
            }
        })
        .then( function () {
            console.log(`Input data --> ticker: ${ticker}, interval: ${interval}, period: ${period}, upperSell: ${upperSell}, lowerSell: ${lowerSell}, 
            initHolding: ${initHolding}, lowerIndicator: ${lowerIndicator}, upperIndicator: ${upperIndicator}`)
        });
}
