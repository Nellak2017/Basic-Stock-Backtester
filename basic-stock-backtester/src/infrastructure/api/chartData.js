import axios from 'axios';
// Call the API to get the Chart data. Pass it through the data transformer and return it to the caller.

// 1. Call the API to get the data
// 2. Pass it through the data transformer
// 3. Return that transformed data to the caller

export const getChartData = (ticker, interval, period, upperSell, lowerSell, initHolding,
    strategy, lowerIndicator, upperIndicator) => {
        const URL = `http://localhost:5000/${strategy}?ticker=${ticker}&interval=${interval}&period=${period}&upperSell=${upperSell}&lowerSell=${lowerSell}&initHolding=${initHolding}&lowerIndicator=${lowerIndicator}&upperIndicator=${upperIndicator}`
        axios.get(URL, {
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => response)
        .catch( error => {
            console.error(error)
        })
        .then( function () {
            console.log(`Input data --> ticker: ${ticker}, interval: ${interval}, period: ${period}, upperSell: ${upperSell}, lowerSell: ${lowerSell}, 
            initHolding: ${initHolding}, lowerIndicator: ${lowerIndicator}, upperIndicator: ${upperIndicator}`)
        });
}
