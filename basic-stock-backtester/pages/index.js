import * as content from '../src/infrastructure/content/homeContent.js'
import * as CONSTANTS from '../src/infrastructure/content/constants'
import * as helpers from '../src/infrastructure/data-transformers/helpers'
import Head from 'next/head'
import ChartOptions from '../src/presentation/components/molecules/chartOptions/chartOptions.js'
import FormInput from '../src/presentation/components/molecules/formInput/formInput.js'
import { useState, useLayoutEffect, useEffect, useMemo, useRef } from 'react'
import { getChartData } from '../src/infrastructure/api/chartData.js'
import { conservativeMomentumBacktesterFunction } from '../src/infrastructure/backtester-algos/backtester'
import { getSmaDataPoint } from '../src/infrastructure/backtester-algos/getSma'
import { StockPeriodBtn } from '../src/presentation/components/molecules/chartOptions/chartOptions.elements.js'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import moment from 'moment';

// @ Todo: Understand Anonymous and make sure it will work in general
// @ Todo: Clean up onPageLoad. Object.keys()[0] is ugly, find a more elgant way
// @ Todo: Clean up glued together functions. You are mapping and the resultant is inconvient to use ([{}, {}, ..] vs {1D: {}, 1WK: {}})
// @ Todo: If you are going to use the Map method of transforming  --> ([{}, {}, ..] vs {1D: {}, 1WK: {}}), then write a helper method to transform into useful form
// @ Todo: Get the rest of the Period datas, not just one period
// @ Todo: Write OnSubmit
// @ Todo: Write OnPeriod Change
// @ Todo: E2E tests
// @ Todo: Integration Tests

export default function Home() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )

  // Define Variables
  // ----------------
  const backtester = conservativeMomentumBacktesterFunction // Rename backtester function, as it is too long
  const [HighlightedPeriod, setHighlightedPeriod] = useState(CONSTANTS.ONE_DAY)
  const [Profit, setProfit] = useState(1)
  const [InMarket, setInMarket] = useState(CONSTANTS.INIT_HOLDING) // if you are invested or not
  const [APIData, setAPIData] = useState(content.defaultAPIData) // Stores literal API Response in it's totality, initially empty for each period
  const [SMA, setSMA] = useState(content.defaultSMA) // Stores the Simple Moving Average for the 2 intervals I am considering, sma24 and sma12 for each period
  const [Displayed, setDisplayed] = useState(content.defaultDisplayed) // Shows what is on the chart (for now only works with ema12 and ema24 indicators)
  const [ChartRange, setChartRange] = useState(3600)
  const [formValues, setFormValues] = useState(content.defaultFormValues)

  // Memo
  // ----------------

  // Memoize values, ema12, ema24 for each chart
  const chartDataMemo = useMemo(() => {

  }, [APIData])

  // Helper Functions
  // ----------------

  // Get the stock data for one period, and store in API data object
  const getPeriod = async (ticker, period, interval) => {
    const form = { ticker, interval, period }
    const response = await getChartData(form)
    setAPIData({ ...APIData, [period]: response.data })
  }

  // Get the SMA data for one date, and store in SMA data object
  const getSMA = async (ticker, date, period) => {
    const sma24 = await getSmaDataPoint(ticker, date, 24)
    const sma12 = await getSmaDataPoint(ticker, date, 12)
    setSMA(prevSMA => ({ ...prevSMA, [period]: { ...prevSMA[period], "sma12": typeof sma12 === "undefined" ? -1 : sma12["sma"] } }))
    setSMA(prevSMA => ({ ...prevSMA, [period]: { ...prevSMA[period], "sma24": typeof sma24 === "undefined" ? -1 : sma24["sma"] } }))
  }
  // Asyncronously set the Displayed data once the API data has been fetched 
  const anonymous = async () => {

    // These are computed for one stock, but they are needed for all of them in backtester for it to work
    const initiallyHolding = formValues.initHolding === "false" ? false : true;
    const upperSell = parseFloat(formValues.upperSell)
    const lowerSell = parseFloat(formValues.lowerSell)

    // 1.3 Verify the API data exists before trying to use it
    if (Object.values(APIData).every(periodAPIData => periodAPIData !== null && typeof periodAPIData !== 'undefined' && Object.values(periodAPIData).length) > 0) throw new Error(`APIData for a particular period is null, undefined, or is empty inside onPageLoad, verify you processed API data properly`)

    // 2. Process Raw API data into input consumable by the Backtester
    const backtestedInputList = Object.keys(APIData).map(period => ({ [period]: Object.values(APIData[period]).length > 0 ? helpers.toBacktesterInput(APIData[period]) : [] })) // Convert API Data into backtester friendly input, for each period. return expected [{[period] : backtesterInput},...]

    // 2.1 Verify backtester output exists before using
    if (backtestedInputList === null || typeof backtestedInputList === 'undefined' || !Array.isArray(backtestedInputList)) throw new Error(`backtestedInput is ${backtestedInputList} inside onPageLoad, verify that the helper function works`)

    // 3. Pass backtester input to backtester to be backtested
    const backtestedOutputList = backtestedInputList.map(periodObj =>
    ({
      [Object.keys(periodObj)[0]]: Object.values(periodObj)[0].length > 0 && !!periodObj[Object.keys(periodObj)[0]][0] ?
        backtester(
          Object.values(periodObj)[0],
          SMA[Object.keys(periodObj)[0]]["sma24"],
          SMA[Object.keys(periodObj)[0]]["sma12"],
          initiallyHolding,
          upperSell,
          lowerSell)
        : []
    })) // return expected [{[period] : backtesterOutput},...]

    // 3.1 Verify backtested output exists and is a list with atleast one object before using
    if (backtestedOutputList === null || typeof backtestedOutputList === 'undefined' || !Array.isArray(backtestedOutputList) || Object.values(backtestedOutputList).length <= 0) throw new Error(`backtestedOutput is ${backtestedOutputList} inside onPageLoad, verify that the helper function works`)

    // 3.2 Transform ugly input to useful form, then update the profit
    const backtested = {} // initialize empty object
    for (const dict of backtestedOutputList) {
      const thePeriod = Object.keys(dict)[0]
      const theValues = Object.values(dict)[0]
      backtested[thePeriod] = Object.values(dict)[0].length > 0 ? theValues : []
    }
    const btLen = backtested[HighlightedPeriod].length - 1
    const btInfo = backtested[HighlightedPeriod]
    setProfit(btInfo != null && btLen > 0 ? btInfo[btLen]["current_profitability_multiplier"] : Profit) // Set the profit to be the last profit from the backtester

    // 4. Pass backtester output to the memo object maker function
    const memoObjList = backtestedOutputList.map(periodObj => ({ [Object.keys(periodObj)[0]]: Object.values(periodObj)[0].length > 0 ? helpers.toMemoObject(Object.values(periodObj)[0]) : [] })) // return expected [{[period] : memoObj},...]

    // 4.1 Verify that the memoObject exists and has object keys
    if (memoObjList === null || typeof memoObjList === 'undefined' || Object.keys(memoObjList).length === 0) throw new Error(`memoObj is ${memoObjList} inside onPageLoad, verify that the helper function works`)

    // 5. Set Displayed to be the memoObject for each period the chart can display
    const display = {} // initialize empty object
    for (const dict of memoObjList) {
      const thePeriod = Object.keys(dict)[0]
      const theValues = Object.values(dict)[0]
      display[thePeriod] = Object.values(dict)[0]["values"].length > 0 ? theValues : content.defaultDisplayed[thePeriod]
    }
    setDisplayed(display)

    // 5.1 Verify Displayed Visible Period Exists and has atleast 1 element
    if (Displayed[HighlightedPeriod] === null || typeof Displayed[HighlightedPeriod] === 'undefined' || Object.values(Displayed[HighlightedPeriod]).length === 0) throw new Error(`Displayed visible period is ${Displayed[HighlightedPeriod]} inside "Display" useState, check onPageLoad`)

    // 5.2 Verify Displayed Visible Period has proper numbers too
    if (Object.values(Displayed[HighlightedPeriod]).every(value => typeof value === 'number' && !isNaN(value))) throw new Error(`Not every value in the visible period's memo object is a number, check onPageLoad`)

    // 6. Set the Chart Range and the Profit, using data in the Visible Period's Display
    // const visiblePeriodMemoObj = Object.values(Displayed[HighlightedPeriod])
    // const len = visiblePeriodMemoObj[0].length
    // setChartRange(len) // Set the chart range to match visible period length

  }

  // Hooks
  // ----------------

  // onPageLoad, Get Default values for chart 
  useLayoutEffect(() => {
    // 1. Get the stock data for all periods
    getPeriod(formValues["ticker"], CONSTANTS.ONE_DAY, content.defaultStockIntervals[CONSTANTS.ONE_DAY]) // for (let period of Object.keys(content.defaultStockIntervals)) 
    // 1.1 Get the SMA data for 1D period, using today's date
    getSMA(formValues["ticker"], moment().format(CONSTANTS.DATE_FORMAT), CONSTANTS.ONE_DAY)
  }, [])

  // Subscribe to API Data to change the chart data properly for both onSubmit and onPageLoad
  useEffect(() => {
    // 1.2 Get the SMA data for the other periods, using the dates provided by the API
    // for each period, get sma data using form value's ticker and the date provided by the API data 
    anonymous()
  }, [APIData])

  // OnPeriod Change, after first mount
  const periodListJustMounted = useRef(true)
  useEffect(() => {

    if (!periodListJustMounted.current) {

      // if no memo data for period
      if (Object.values(APIData[HighlightedPeriod]).length === 0) {
        console.log(`No API data found for period: ${HighlightedPeriod}`)
        console.log(`Chart range ${ChartRange}`)
        // get one stock period data
        getPeriod(formValues["ticker"], HighlightedPeriod, content.defaultStockIntervals[HighlightedPeriod])
        getSMA(formValues["ticker"], moment().format(CONSTANTS.DATE_FORMAT), HighlightedPeriod)
      } else { // if memo data for period (else)
        console.log(`API data found for period:`)
        console.log(APIData[HighlightedPeriod])
        const visiblePeriodMemoObj = Object.values(Displayed[HighlightedPeriod])
        const len = visiblePeriodMemoObj[0].length
        setChartRange(len) // Set the chart range to match visible period length
        // setChartRange(ChartRange) 
        setProfit(Profit)
      }
    } else {
      console.log("This is the first render")
    }
    periodListJustMounted.current = false
  }, [HighlightedPeriod, APIData])

  const handleSubmit = e => {
    e.preventDefault()
    console.log(APIData)
    console.log(SMA)
    console.log(Displayed)
    console.log(Profit)
  }

  const onChange = e => setFormValues({ ...formValues, [e.target.name]: e.target.value })

  return (
    <>
      <Head>
        <title>Basic Stock Backtester</title>
        <meta name="description" content="A simple stock backtester project that can help you test a few pre-made stock trading strategies interactively on a website." />
        <link rel="icon" href="/Nellak2017-Logo.jpg" />
      </Head>

      <main>
        <section className="main-section">
          <h1 id="Site-Name">
            Basic Stock Backtester
          </h1>
          <h1>HighlightedPeriod:{HighlightedPeriod}</h1>
          <h1>length of HighlightedPeriod data: {Object.values(APIData[HighlightedPeriod]).length}</h1>
          <h1>Chart range: {ChartRange}</h1>
          <h1>profit: {Profit}</h1>
          <section className="subtitle-container">
            <h2 id="Stock-Name">{formValues.ticker}</h2>
            <h3 id="Upper-Sell-Target">{`Upper Sell Target: ${formValues.upperSell}`}</h3>
            <h3 id="Lower-Sell-Target">{`Lower Sell Target: ${formValues.lowerSell}`}</h3>
          </section>
          <section className="chart-container">
            <Line
              options={content.options}
              data={helpers.chartData(Object.keys(content.colors), helpers.range(0, ChartRange), Displayed[HighlightedPeriod], content.colors)}
            />
            <ChartOptions>
              {content.chartStockPeriods.map((period) => (
                <StockPeriodBtn
                  key={period.id}
                  style={HighlightedPeriod === period.value ? { borderBottom: '2px solid Aqua' } : {}}
                  onClick={() => { setHighlightedPeriod(period.value) }}>
                  {period.value}
                </StockPeriodBtn>
              ))}
            </ChartOptions>
          </section>
          <form onSubmit={handleSubmit}>
            <div className="form-container">
              {content.formInputs.map((input) => (
                <FormInput
                  key={input.id}
                  {...input}
                  value={formValues[input.name]}
                  onChange={onChange} />
              ))}
            </div>
            <span><button>Submit</button></span>
          </form>
          <h1 id="Profit-Heading" style={{ marginTop: "2rem" }}>{`Profitability for ${HighlightedPeriod}`}</h1>
          <h2 id="Profit" style={{ marginBottom: "2rem" }}>{`${Profit.toFixed(2)} x input money`}</h2>
          <h1 id="Stock-Status-Heading">Stock Status</h1>
          <h2 id="Stock-Status">{InMarket ? "In the Market, Holding" : "Out of the Market, Holding"}</h2>
        </section>
      </main>
    </>
  )
}