import { useState, useEffect, useMemo } from 'react'
import { getChartData } from '../src/infrastructure/api/chartData.js'
import Head from 'next/head'
import ChartOptions from '../src/presentation/components/molecules/chartOptions/chartOptions.js'
import { StockPeriodBtn } from '../src/presentation/components/molecules/chartOptions/chartOptions.elements.js'
import FormInput from '../src/presentation/components/molecules/formInput/formInput.js'
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
} from 'chart.js';
import {
  formInputs,
  chartStockPeriods,
  options,
  chartData,
  extractData,
  chartLabels,
  range,
  daysInterval,
  colors,
  defaultStockIntervals,
  defaultAPIData,
  DTO
} from '../src/infrastructure/content/homeContent.js'
import {
  ONE_DAY,
  ONE_WEEK,
  ONE_MONTH,
  THREE_MONTHS,
  ONE_YEAR,
  FIVE_YEARS,
  ALL,
  ONE_MINUTE,
  TWO_MINUTES,
  FIVE_MINUTES,
  FIFTEEN_MINUTES,
  THIRTY_MINUTES,
  NINETY_MINUTES,
  ONE_HOUR,
  FIVE_DAYS,
  DEFAULT_TICKER,
  UPPER_SELL,
  LOWER_SELL,
  INIT_HOLDING,
  STRATEGY,
  EMA_LOWER_INDICATOR,
  EMA_UPPER_INDICATOR
} from '../src/infrastructure/content/constants'
import axios from 'axios'

export default function Home() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  const [HighlightedPeriod, setHighlightedPeriod] = useState(ONE_DAY);
  const [Profit, setProfit] = useState(1);
  const [InMarket, setInMarket] = useState(INIT_HOLDING); // if you are invested or not
  const [APIData, setAPIData] = useState(defaultAPIData);
  const [ChartRange, setChartRange] = useState(3600);
  const [formValues, setFormValues] = useState({
    ticker: DEFAULT_TICKER,
    interval: ONE_MINUTE,
    upperSell: UPPER_SELL,
    lowerSell: LOWER_SELL,
    initHolding: INIT_HOLDING,
    strategy: STRATEGY,
    lowerIndicator: EMA_LOWER_INDICATOR,
    upperIndicator: EMA_UPPER_INDICATOR
  });

  // Get Default values for chart on page load
  useEffect(() => {
    /**
     * getDefaultChartData(all 6 periods)
     * try { load(period)}
     * catch { err => display(err)}
     */
    getChartData(DTO("1D", "1M"), (res) => { setAPIData(prev => ({ ...prev, ["1D"]: res.data })) }, (err) => { console.error(err) });
    getChartData(DTO("1WK", "5M"), (res) => { setAPIData(prev => ({ ...prev, ["1WK"]: res.data })) }, (err) => { console.error(err) });
    getChartData(DTO("1MO", "15M"), (res) => { setAPIData(prev => ({ ...prev, ["1MO"]: res.data })) }, (err) => { console.error(err) });
    getChartData(DTO("3MO", "1H"), (res) => { setAPIData(prev => ({ ...prev, ["3MO"]: res.data })) }, (err) => { console.error(err) });
    getChartData(DTO("1Y", "1D"), (res) => { setAPIData(prev => ({ ...prev, ["1Y"]: res.data })) }, (err) => { console.error(err) });
    getChartData(DTO("5Y", "1WK"), (res) => { setAPIData(prev => ({ ...prev, ["5Y"]: res.data })) }, (err) => { console.error(err) });
  }, [])

  // When API Data is called or the Period is changed, call this
  useEffect(() => {
    //debugger
    if (APIData[HighlightedPeriod] !== undefined && APIData[HighlightedPeriod].length != 0) {
      const dataPt = APIData[HighlightedPeriod]["data"]
      debugger
      const len = dataPt.length
      debugger
      setProfit(dataPt[len - 1]["current_profitability_multiplier"])
      setInMarket(dataPt[len - 1]["holding_stock"])
      setChartRange(len)
      console.log(dataPt)
    } else {
      getChartData(DTO(HighlightedPeriod, formValues), (res) => { setAPIData(prev => ({ ...prev, ["1D"]: res.data })) }, (err) => { console.error(err) });
    }
  }, [APIData, HighlightedPeriod])

  const extractChartData = (Period) => {
    //debugger
    if (APIData[Period].length != 0) {
      return {
        "values": extractData(APIData[Period].data, "value"),
        "ema24": extractData(APIData[Period].data, "ema24"),
        "ema12": extractData(APIData[Period].data, "ema12")
      }
    }
    else {
      return {
        "values": extractData(defaultResData, "value"),
        "ema24": extractData(defaultResData, "ema24"),
        "ema12": extractData(defaultResData, "ema12")
      }
    }
  }

  // Memoize the Default Chart Periods so that there can be a quick user Response time
  const chartDataMemo = useMemo(() => {
    let memo = {}
    for (let x of Object.keys(defaultStockIntervals)) {
      memo[x] = extractChartData(x)
    }
    let v = memo[HighlightedPeriod]
    let u = [...Object.keys({
      "values": "black",
      "ema24": "Red",
      "ema12": "Green"
    }).map((dataSetLabel) => ({
      label: dataSetLabel,
      data: v[dataSetLabel],
      borderColor: colors[dataSetLabel],
      backgroundColor: colors[dataSetLabel],
      pointRadius: 0
    }))]

    //debugger
    return memo
  }, [APIData])

  const handleSubmit = (e) => {
    e.preventDefault();
    formValues["period"] = HighlightedPeriod;
    getChartData(formValues,
      (res) => { setAPIData({ ...APIData, [HighlightedPeriod]: res.data.data }) },
      (err) => { console.error(err); alert("Error Fetching Stock Data") }
    )

  };

  const onChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  // Todo: Clean this up
  // Todo: Improve error handling
  // Todo: Add Client Side Data Validation
  // Todo: Fix the API sending "strategy", it should join it with "-" and server should handle it
  // Todo: move range, daysinterval, and extract data to the data transformers
  // Todo: Figure out why the chart isn't displaying properly
  // Todo: Refactor the chartData API and the API data structure in this file to be cleaner
  // Todo: Handle the Chart data properly and transform the data as required
  // Todo: fix styles. Make responsive, Make prettier (Optional)
  return (
    <>
      <Head>
        <title>Basic Stock Backtester</title>
        <meta name="description" content="A simple stock backtester project that can help you test a few pre-made stock trading strategies interactively on a website." />
        <link rel="icon" href="/Nellak2017-Logo.jpg" />
      </Head>

      <main>
        <h1>{`1D: ${APIData["1D"].length == 0 ? "none" : APIData["1D"][0]}`}</h1>
        <h1>{`1WK: ${APIData["1WK"].length == 0 ? "none" : APIData["1WK"][0]}`}</h1>
        <h1>{`1MO: ${APIData["1MO"].length == 0 ? "none" : APIData["1MO"][0]}`}</h1>
        <h1>{`3MO: ${APIData["3MO"].length == 0 ? "none" : APIData["3MO"][0]}`}</h1>
        <h1>{`1Y: ${APIData["1Y"].length == 0 ? "none" : APIData["1Y"][0]}`}</h1>
        <h1>{`5Y: ${APIData["5Y"].length == 0 ? "none" : APIData["5Y"][0]}`}</h1>
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
            <Line
              options={options}
              data={chartData(Object.keys(colors), range(0, ChartRange), chartDataMemo[HighlightedPeriod], colors)}
            />
            <ChartOptions>
              {chartStockPeriods.map((period) => (
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
              {formInputs.map((input) => (
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
