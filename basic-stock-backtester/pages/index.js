import { useState, useLayoutEffect, useEffect, useMemo, useRef } from 'react'
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

import {
  getSmaDataPoint
} from '../src/infrastructure/backtester-algos/backtester';

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
  useLayoutEffect(() => {
    console.log(process.env.NEXT_PUBLIC_RAPIDAPI_KEY);
    const getPeriod = async (ticker, period, interval) => {
      const form = { ticker, interval, period };
      const response = await getChartData(form);
      const data = response.data.chart.result[0].indicators.adjclose[0].adjclose;
      setAPIData({ ...APIData, [period]: data })
      console.log(APIData)
    }
    /*
    for (let period of Object.keys(defaultStockIntervals)){
      getPeriod(formValues["ticker"], period, defaultStockIntervals[period]);
    }
    */
   getPeriod(formValues["ticker"], ONE_DAY, defaultStockIntervals[ONE_DAY])
  }, [])

  const chartDataMemo = useMemo(() => {
  }, [APIData])

  // OnPeriod Change, after first mount
  const periodListJustMounted = useRef(true)
  useEffect(() => {

    if (!periodListJustMounted.current) {

    }
    periodListJustMounted.current = false;
  }, [HighlightedPeriod])

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(APIData)
  };

  const onChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };


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

/** 
 <Line
              options={options}
              data={chartData(Object.keys(colors), range(0, ChartRange), chartDataMemo[HighlightedPeriod], colors)}
            />
*/