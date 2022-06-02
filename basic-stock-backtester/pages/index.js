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

// @ Todo: Clean up onPageLoad. Object.keys()[0] is ugly, find a more elgant way

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

  // Get the stock data for one period
  const getPeriod = async (ticker, period, interval) => {
    const form = { ticker, interval, period }
    const response = await getChartData(form)
    console.log(response.data)
    setAPIData({ ...APIData, [period]: response.data })
  }

  /**
   * onPageLoad :
   *  ~get all the period stock data and store values in APIData
   *  (let memo run)
   *  display visible period in line chart (Set the data so Line chart can display it)
   *  
   * when APIData is changed:
   *  memoize the values and calculate the EMA values and store them too
   * 
   * onPeriodChange :
   *  if there is data in the memo for this period, display it
   *  else fetch the data and use that data, if you can't display error fetching data
   * 
   * onSubmit:
   *  get all the period stock data and store values in APIData
   *  (let memo run)
   *  display visible period in line chart
   */

  // Hooks
  // ----------------

  // onPageLoad, Get Default values for chart 
  useLayoutEffect(() => {
    // 1. Get the stock data for all periods
    getPeriod(formValues["ticker"], CONSTANTS.ONE_DAY, content.defaultStockIntervals[CONSTANTS.ONE_DAY]) // for (let period of Object.keys(content.defaultStockIntervals)) 
  }, [])

  // Subscribe to API Data to change the chart data properly for both onSubmit and onPageLoad
  const chartDataUpdater = useEffect(() => {
    const anonymous = async () => {
      // These are computed for one stock, but they are needed for all of them in backtester for it to work
      const initiallyHolding = formValues.initHolding
      const upperSell = formValues.upperIndicator
      const lowerSell = formValues.lowerIndicator

      // 1.1 Verify the API data exists before trying to use it
      if (Object.values(APIData).every(periodAPIData => periodAPIData !== null && typeof periodAPIData !== 'undefined' && Object.values(periodAPIData).length) > 0) throw new Error(`APIData for a particular period is null, undefined, or is empty inside onPageLoad, verify you processed API data properly`)

      // 2. Process Raw API data into input consumable by the Backtester
      console.log(APIData)
      const backtestedInputList = Object.keys(APIData).map(period => ({ [period]: Object.values(APIData[period]).length > 0 ? helpers.toBacktesterInput(APIData[period]) : [] })) // Convert API Data into backtester friendly input, for each period. return expected [{[period] : backtesterInput},...]

      // 2.1 Verify backtester output exists before using
      if (backtestedInputList === null || typeof backtestedInputList === 'undefined' || !Array.isArray(backtestedInputList)) throw new Error(`backtestedInput is ${backtestedInputList} inside onPageLoad, verify that the helper function works`)

      console.log(backtestedInputList)
      console.log(backtestedInputList[0])
      console.log(Object.values(backtestedInputList[0])[0])
      console.log(backtestedInputList[0]["1D"])
      console.log(backtestedInputList[0]["1D"][0])
      console.log(!!backtestedInputList[0]["1D"][0] ? backtestedInputList[0]["1D"][0]["date"] : "it is undefined")
      // 3. Pass backtester input to backtester to be backtested



      // ----------------------------------  WHERE YOU LEFT OFF LAST TIME
      //
      // The main issue it seems here is that backtester is getting promises because getSMA returns a promise, and I can't await it 
      // There will inevitably be more issues down the road, but this is the biggest one right now


      const backtestedOutputList = backtestedInputList.map(periodObj =>
      ({
        [Object.keys(periodObj)[0]]: Object.values(periodObj)[0].length > 0 && !!periodObj[Object.keys(periodObj)[0]][0] ?
          backtester(
            Object.values(periodObj)[0],
            await getSmaDataPoint(formValues.ticker, periodObj[Object.keys(periodObj)[0]][0]["date"], 24),
            await getSmaDataPoint(formValues.ticker, periodObj[Object.keys(periodObj)[0]][0]["date"], 12),
            initiallyHolding,
            upperSell,
            lowerSell)
          : []
      })) // return expected [{[period] : backtesterOutput},...]

      // 3.1 Verify backtested output exists and is a list with atleast one object before using
      console.log(backtestedOutputList)
      if (backtestedOutputList === null || typeof backtestedOutputList === 'undefined' || !Array.isArray(backtestedOutputList) || Object.values(backtestedOutputList).length <= 0) throw new Error(`backtestedOutput is ${backtestedOutputList} inside onPageLoad, verify that the helper function works`)

      // 4. Pass backtester output to the memo object maker function
      const memoObjList = backtestedOutputList.map(periodObj => ({ [Object.keys(periodObj)[0]]: Object.values(periodObj)[0].length > 0 ? helpers.toMemoObject(Object.values(periodObj)[0]) : [] })) // return expected [{[period] : memoObj},...]

      console.log(memoObjList)
      // 4.1 Verify that the memoObject exists and has object keys
      if (memoObjList === null || typeof memoObjList === 'undefined' || Object.keys(memoObjList).length === 0) throw new Error(`memoObj is ${memoObjList} inside onPageLoad, verify that the helper function works`)

      // 5. Set Displayed to be the memoObject for each period the chart can display
      for (let [index, period] of Object.keys(Displayed)) setDisplayed({ ...Displayed, [Object.keys(memoObjList[index])[0]]: Object.values(memoObjList[index])[0] }) // This assumes that the periods in the MemoObjList are all valid

      // 5.1 Verify Displayed Visible Period Exists and has atleast 1 element
      if (Displayed[HighlightedPeriod] === null || typeof Displayed[HighlightedPeriod] === 'undefined' || Object.values(Displayed[HighlightedPeriod]).length === 0) throw new Error(`Displayed visible period is ${Displayed[HighlightedPeriod]} inside "Display" useState, check onPageLoad`)

      // 5.2 Verify Displayed Visible Period has proper numbers too
      if (Object.values(Displayed[HighlightedPeriod]).every(value => typeof value === 'number' && !isNaN(value))) throw new Error(`Not every value in the visible period's memo object is a number, check onPageLoad`)

      // 6. Set the Chart Range and the Profit, using data in the Visible Period's Display
      const visiblePeriodMemoObj = Object.values(Displayed[HighlightedPeriod])
      const len = visiblePeriodMemoObj[0].length
      setChartRange(len) // Set the chart range to match visible period length
      setProfit(visiblePeriodMemoObj != null && len > 0 ? visiblePeriodMemoObj[0][len - 1] : Profit) // Set the profit to be the last profit from the backtester

    }
    anonymous()
  }, [APIData])

  // OnPeriod Change, after first mount
  const periodListJustMounted = useRef(true)
  useEffect(() => {

    if (!periodListJustMounted.current) {

    }
    periodListJustMounted.current = false
  }, [HighlightedPeriod])

  const handleSubmit = e => {
    e.preventDefault()
    console.log(APIData)
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
          <section className="subtitle-container">
            <h2 id="Stock-Name">{formValues.ticker}</h2>
            <h3 id="Upper-Sell-Target">{`Upper Sell Target: ${formValues.upperSell}`}</h3>
            <h3 id="Lower-Sell-Target">{`Lower Sell Target: ${formValues.lowerSell}`}</h3>
          </section>
          <section className="chart-container">

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

/** 
 <Line
              options={options}
              data={chartData(Object.keys(colors), range(0, ChartRange), chartDataMemo[HighlightedPeriod], colors)}
            />
*/