import { useState, useLayoutEffect, useEffect, useMemo, useRef } from 'react'
import { getChartData, getChartDataAsync } from '../src/infrastructure/api/chartData.js'
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
  chartLabels,
  colors,
  defaultStockIntervals,
  defaultAPIData,
  defaultResData
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
import {
  range,
  daysInterval,
  extractData,
  DTO,
  chartData,
} from '../src/infrastructure/data-transformers/helpers'

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

  const [oneDayTest, setOneDayTest] = useState([]);
  const [oneWeekTest, setOneWeekTest] = useState([]);

  /*
  useEffect(() => {
    debugger;
    console.log("API Data Changed");
    console.log(APIData);
  }, [APIData])
  */
  useEffect(() => {
    debugger;
    console.log("API Data Changed")
    console.log(oneDayTest)
    console.log(oneWeekTest)
  }, [oneDayTest, oneWeekTest])

  // Get Default values for chart on page load

  // BUG: It appears 1D is recieving the wrong data, sometimes. Unknown if API issue or client side issue.
  // BUG: It appears that on a properly formatted api request, sometimes the data returned is for another period.
  // BUG: It appears that sometimes it gets the right data and then it gets changed to the wrong data.

  useLayoutEffect(() => {
    // Get HighlightedPeriod values

    const formCopy = JSON.parse(JSON.stringify(formValues))
    formCopy["period"] = HighlightedPeriod;
    console.log(formCopy);
    //console.log(APIData[HighlightedPeriod].length === 0);

    getChartData(
      formCopy,
      (res) => {
        const dataPt = res.data.data
        const len = dataPt.length
        //console.log({ ...APIData, [HighlightedPeriod]: res.data });
        //console.log(APIData[HighlightedPeriod].length);
        setChartRange(prev => len !== undefined ? len : prev);
        setProfit(prev => len !== undefined ? dataPt[len - 1]["current_profitability_multiplier"] : prev);
        setInMarket(prev => len !== undefined ? dataPt[len - 1]["holding_stock"] : prev);
        //setAPIData(APIData[ONE_WEEK].length === 0 ? ({ ...APIData, [HighlightedPeriod]: res.data }) : [])
        setOneDayTest(oneDayTest.length === 0 ? (res.data) : []);
      },
      (err) => { console.error(err) }
    );


    const formCopy2 = JSON.parse(JSON.stringify(formValues))
    formCopy2["period"] = ONE_WEEK;
    formCopy2["interval"] = FIVE_MINUTES;
    console.log(formCopy2);
    //console.log(APIData[ONE_WEEK].length === 0);

    getChartData(
      formCopy2,
      (res) => {
        //setAPIData( APIData[ONE_WEEK].length === 0 ? ({...APIData, [ONE_WEEK]: res.data}) : [])
        setOneWeekTest(oneWeekTest.length === 0 ? (res.data) : []);
      },
      (err) => { console.error(err) }
    );

    /*

    // Get Default for rest
    for (let period of Object.keys(defaultStockIntervals)) {
      const testVariablePeriod = period;
      if (testVariablePeriod !== HighlightedPeriod) {
        
        getChartData(
          {
            ticker: DEFAULT_TICKER,
            period: testVariablePeriod,
            interval: defaultStockIntervals[testVariablePeriod],
            upperSell: UPPER_SELL,
            lowerSell: LOWER_SELL,
            initHolding: INIT_HOLDING,
            strategy: STRATEGY,
            lowerIndicator: EMA_LOWER_INDICATOR,
            upperIndicator: EMA_UPPER_INDICATOR
          },
          (res) => { 
            //console.log({ ...APIData, [testVariablePeriod]: res.data });
            debugger;
            setAPIData(({ ...APIData, [testVariablePeriod]: res.data }))
          },
          (err) => { console.error(err) }
        )
      }
    }

    */

  }, [])

  const extractChartData = (Period) => {
    if (APIData[Period] !== undefined && APIData[Period].length != 0) {
      return {
        "values": extractData(APIData[Period].data, "value"),
        "ema24": extractData(APIData[Period].data, "ema24"),
        "ema12": extractData(APIData[Period].data, "ema12")
      }
    }
    else {
      return {
        "values": [],
        "ema24": [],
        "ema12": []
      }
    }
  }

  const chartDataMemo = useMemo(() => {
    let memo = JSON.parse(JSON.stringify(defaultAPIData)); // Note: Be sure to do a deep object copy, so that you don't accidentally modify memo!!
    for (let x of Object.keys(defaultStockIntervals)) {
      memo[x] = extractChartData(x)
    }
    return memo
  }, [APIData])

  // OnPeriod Change, after first mount
  /*
  const periodListJustMounted = useRef(true)
  useEffect(() => {
    
    if (!periodListJustMounted.current) {
      if (APIData[HighlightedPeriod] !== undefined && Object.keys(APIData[HighlightedPeriod]).length > 0) {
        const dataPt = APIData[HighlightedPeriod]["data"]
        const len = dataPt.length

        debugger;
        console.log(`The dataPt in Highlighted Period useEffect ${dataPt}`)
        debugger;

        setProfit(dataPt[len - 1]["current_profitability_multiplier"])
        setInMarket(dataPt[len - 1]["holding_stock"])
        setChartRange(len)
      } else {
        getChartData(DTO(HighlightedPeriod, defaultStockIntervals[HighlightedPeriod], formValues), 
        (res) => {
          setAPIData(APIData[HighlightedPeriod].length === 0 ? ({ ...APIData, [HighlightedPeriod]: res.data }) : ({ ...APIData, [HighlightedPeriod]: [] }))
        },
          (err) => { console.error(err); alert("Error Fetching Stock Data") }
        );
      }
    }
    periodListJustMounted.current = false;
  }, [HighlightedPeriod])

  */

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(chartDataMemo);
    console.log(oneDayTest);
    console.log(oneWeekTest);
    //console.log(APIData);
    console.log(ChartRange);

    /*
    formValues["period"] = HighlightedPeriod;
    getChartData(formValues,
      (res) => { setAPIData({ ...APIData, [HighlightedPeriod]: res.data.data }) },
      (err) => { console.error(err); alert("Error Fetching Stock Data") }
    )
      */
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