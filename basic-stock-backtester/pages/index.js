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
  conservativeMomentumBacktesterFunction
} from '../src/infrastructure/backtester-algos/backtester'

import {
  getSmaDataPoint
} from '../src/infrastructure/backtester-algos/getSma'

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
    /*
    const getPeriod = async (ticker, period, interval) => {
      const form = { ticker, interval, period };
      const response = await getChartData(form);
      const data = response.data.chart.result[0].indicators.adjclose[0].adjclose;
      setAPIData({ ...APIData, [period]: data })
      console.log(APIData)
    }
    
    for (let period of Object.keys(defaultStockIntervals)){
      getPeriod(formValues["ticker"], period, defaultStockIntervals[period]);
    }
    
    
   getPeriod(formValues["ticker"], ONE_DAY, defaultStockIntervals[ONE_DAY])
   */
    // other input variables
    const initSMA24 = 2685.78;
    const initSMA12 = 3029.18;
    const initHolding = false;
    const upperSell = 1.1;
    const lowerSell = .95;

    // input
    const goodInput2 = [
      { 'ticker': 'ETH-USD', 'date': '2022:04:30 00:00:00', 'value': 2815.533447265625 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:01 00:00:00', 'value': 2729.994140625 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:02 00:00:00', 'value': 2827.614013671875 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:03 00:00:00', 'value': 2857.15234375 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:04 00:00:00', 'value': 2783.131103515625 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:05 00:00:00', 'value': 2940.2265625 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:06 00:00:00', 'value': 2748.931640625 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:07 00:00:00', 'value': 2694.991943359375 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:08 00:00:00', 'value': 2636.121826171875 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:09 00:00:00', 'value': 2518.50830078125 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:10 00:00:00', 'value': 2242.650390625 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:11 00:00:00', 'value': 2342.754150390625 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:12 00:00:00', 'value': 2072.504638671875 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:13 00:00:00', 'value': 1960.12255859375 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:14 00:00:00', 'value': 2014.2806396484375 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:15 00:00:00', 'value': 2056.18310546875 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:16 00:00:00', 'value': 2145.8369140625 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:17 00:00:00', 'value': 2022.88232421875 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:18 00:00:00', 'value': 2090.4599609375 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:19 00:00:00', 'value': 1916.1495361328125 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:20 00:00:00', 'value': 2018.0001220703125 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:21 00:00:00', 'value': 1961.0179443359375 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:22 00:00:00', 'value': 1974.670654296875 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:23 00:00:00', 'value': 2042.3447265625 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:24 00:00:00', 'value': 1972.390869140625 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:25 00:00:00', 'value': 1978.677001953125 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:26 00:00:00', 'value': 1945.0333251953125 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:27 00:00:00', 'value': 1802.5438232421875 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:28 00:00:00', 'value': 1724.635986328125 },
      { 'ticker': 'ETH-USD', 'date': '2022:05:30 00:00:00', 'value': 1811.2347412109375 }
    ] // (ETH-USD, 1D, 1mo) (as of May 29 2022)

    // output
    const goodOutput2 = [
      { 'ticker': 'ETH-USD', 'date': '2022:04:30 00:00:00', 'value': 2729.994140625, 'ema24': 2696.16027578125, 'ema12': 2996.3112995793267, 'holding_stock': true, 'current_profitability_multiplier': 1.0, 'position_evaluation': 'BUY', 'position_two_step_evaluation': 'BUY and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:01 00:00:00', 'value': 2827.614013671875, 'ema24': 2698.8669849687503, 'ema12': 2955.3394289709686, 'holding_stock': true, 'current_profitability_multiplier': 1.0, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:02 00:00:00', 'value': 2857.15234375, 'ema24': 2709.1667472650006, 'ema12': 2935.6893650788, 'holding_stock': true, 'current_profitability_multiplier': 1.0, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:03 00:00:00', 'value': 2783.131103515625, 'ema24': 2721.0055949838006, 'ema12': 2923.606746412831, 'holding_stock': true, 'current_profitability_multiplier': 1.0, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:04 00:00:00', 'value': 2940.2265625, 'ema24': 2725.975635666347, 'ema12': 2901.99510904403, 'holding_stock': true, 'current_profitability_multiplier': 1.0, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:05 00:00:00', 'value': 2748.931640625, 'ema24': 2743.1157098130393, 'ema12': 2907.8768711141793, 'holding_stock': true, 'current_profitability_multiplier': 1.0, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:06 00:00:00', 'value': 2694.991943359375, 'ema24': 2743.5809842779963, 'ema12': 2883.4237587312286, 'holding_stock': true, 'current_profitability_multiplier': 1.0, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:07 00:00:00', 'value': 2636.121826171875, 'ema24': 2739.6938610045063, 'ema12': 2854.43424867402, 'holding_stock': true, 'current_profitability_multiplier': 1.0, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:08 00:00:00', 'value': 2518.50830078125, 'ema24': 2731.408098217896, 'ema12': 2820.8477221352287, 'holding_stock': false, 'current_profitability_multiplier': 0.9225324931300648, 'position_evaluation': 'SELL', 'position_two_step_evaluation': 'SELL and BUY' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:09 00:00:00', 'value': 2242.650390625, 'ema24': 2714.3761144229647, 'ema12': 2774.3339650038474, 'holding_stock': true, 'current_profitability_multiplier': 0.9225324931300648, 'position_evaluation': 'BUY', 'position_two_step_evaluation': 'BUY and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:10 00:00:00', 'value': 2342.754150390625, 'ema24': 2676.6380565191275, 'ema12': 2692.5364920224865, 'holding_stock': true, 'current_profitability_multiplier': 0.9225324931300648, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:11 00:00:00', 'value': 2072.504638671875, 'ema24': 2649.9273440288475, 'ema12': 2638.723824079123, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'SELL', 'position_two_step_evaluation': 'SELL and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:12 00:00:00', 'value': 1960.12255859375, 'ema24': 2603.73352760029, 'ema12': 2551.613180170316, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:13 00:00:00', 'value': 2014.2806396484375, 'ema24': 2552.244650079767, 'ema12': 2460.6146230046907, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:14 00:00:00', 'value': 2056.18310546875, 'ema24': 2509.207529245261, 'ema12': 2391.947856334498, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:15 00:00:00', 'value': 2145.8369140625, 'ema24': 2472.9655753431402, 'ema12': 2340.2917408166904, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:16 00:00:00', 'value': 2022.88232421875, 'ema24': 2446.795282440689, 'ema12': 2310.375613623738, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:17 00:00:00', 'value': 2090.4599609375, 'ema24': 2412.8822457829338, 'ema12': 2266.1458767922013, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:18 00:00:00', 'value': 1916.1495361328125, 'ema24': 2387.0884629952993, 'ema12': 2239.1172743530165, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:19 00:00:00', 'value': 2018.0001220703125, 'ema24': 2349.413348846301, 'ema12': 2189.4299300114467, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:20 00:00:00', 'value': 1961.0179443359375, 'ema24': 2322.900290704222, 'ema12': 2163.056113405118, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:21 00:00:00', 'value': 1974.670654296875, 'ema24': 2293.949702994759, 'ema12': 2131.9733181637057, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:22 00:00:00', 'value': 2042.3447265625, 'ema24': 2268.4073790989282, 'ema12': 2107.7729083380395, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:23 00:00:00', 'value': 1972.390869140625, 'ema24': 2250.322366896014, 'ema12': 2097.7070342187258, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:24 00:00:00', 'value': 1978.677001953125, 'ema24': 2228.0878470755833, 'ema12': 2078.4276242067103, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:25 00:00:00', 'value': 1945.0333251953125, 'ema24': 2208.134979465787, 'ema12': 2063.0813746292356, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' },
      { 'ticker': 'ETH-USD', 'date': '2022:05:26 00:00:00', 'value': 1802.5438232421875, 'ema24': 2187.0868471241492, 'ema12': 2044.920136254786, 'holding_stock': false, 'current_profitability_multiplier': 0.8525416530950017, 'position_evaluation': 'HOLD', 'position_two_step_evaluation': 'HOLD and HOLD' }
    ] // (ETH-USD, 1D, 1mo) (as of May 29 2022)

    const backtested2 = conservativeMomentumBacktesterFunction(
      goodInput2, initSMA24, initSMA12, initHolding, upperSell, lowerSell)

    console.log(backtested2)

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