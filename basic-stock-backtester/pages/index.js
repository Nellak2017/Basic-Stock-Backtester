// react imports
import { useState } from 'react'
// Component imports
import Head from 'next/head'
import MainFlex from '../src/presentation/components/main-flex/main-flex.js'
import SubtitleFlex from '../src/presentation/components/subtitle-flex/subtitle-flex.js'
import InputFlex from '../src/presentation/components/input-flex/input-flex.js'
import ChartFlex from '../src/presentation/components/chart-flex/chart-flex.js'
import ChartOptions from '../src/presentation/components/chart-options/chart-options.js'
import { StockPeriodBtn } from '../src/presentation/components/chart-options/chart-options.elements.js'
import FormInput from '../src/presentation/components/form-input/form-input.js'
// Chart imports
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
import { labels, options, chartData } from '../src/infrastructure/api/chartData.js'
import { formInputs } from '../src/infrastructure/content/homeContent.js'


export default function Home() {
  const [HighlightedPeriod, setHighlightedPeriod] = useState("1D");
  const [Profit, setProfit] = useState(1);
  const [InMarket, setInMarket] = useState(false); // if you are invested or not

  const [formValues, setFormValues] = useState({
    ticker: "ETH-USD",
    interval: "1m",
    upperSell: 1.1,
    lowerSell: .95,
    initHolding: false,
    strategy: "Conservative Momentum",
    lowerIndicator: "EMA-24",
    upperIndicator: "EMA-12"
  });

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const onChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  // Todo: Refactor your form input fields to their own components and handle properly (De-couple)
  // Todo: Refactor the file structure to be cleaner, including renaming the files and functions too
  // Todo: Handle the Chart data properly and transform the data as required
  // Todo: Get the Chart data from the Python Flask API
  // Todo: fix styles. Put forms into globals
  return (
    <>
      {/* The tight coupling in the Head, and for the non-styled components is ok due to the small page size and cost of decoupling it all */}
      <Head>
        <title>Basic Stock Backtester</title>
        <meta name="description" content="A simple stock backtester project that can help you test a few pre-made stock trading strategies interactively on a website." />
        <link rel="icon" href="/Nellak2017-Logo.jpg" />
      </Head>

      <main>
        <MainFlex>
          <h1 id="Site-Name">
            Basic Stock Backtester
          </h1>
          <SubtitleFlex>
            <h2 id="Stock-Name">{formValues.ticker}</h2>
            <h3 id="Upper-Sell-Target">{`Upper Sell Target: ${formValues.upperSell}`}</h3>
            <h3 id="Lower-Sell-Target">{`Lower Sell Target: ${formValues.lowerSell}`}</h3>
          </SubtitleFlex>
          <ChartFlex>
            {/* Fix the File Structure */}
            {/* Move the options/data into a separate file */}
            <Line
              options={options}
              data={chartData}
            />
            {/* Decouple these */}
            <ChartOptions>
              <StockPeriodBtn style={HighlightedPeriod === "1D" ? { borderBottom: '2px solid Aqua' } : {}} onClick={() => { setHighlightedPeriod("1D") }}>
                1D
              </StockPeriodBtn>
              <StockPeriodBtn style={HighlightedPeriod === "1W" ? { borderBottom: '2px solid Aqua' } : {}} onClick={() => { setHighlightedPeriod("1W") }}>
                1W
              </StockPeriodBtn>
              <StockPeriodBtn style={HighlightedPeriod === "1M" ? { borderBottom: '2px solid Aqua' } : {}} onClick={() => { setHighlightedPeriod("1M") }}>
                1M
              </StockPeriodBtn>
              <StockPeriodBtn style={HighlightedPeriod === "3M" ? { borderBottom: '2px solid Aqua' } : {}} onClick={() => { setHighlightedPeriod("3M") }}>
                3M
              </StockPeriodBtn>
              <StockPeriodBtn style={HighlightedPeriod === "1Y" ? { borderBottom: '2px solid Aqua' } : {}} onClick={() => { setHighlightedPeriod("1Y") }}>
                1Y
              </StockPeriodBtn>
              <StockPeriodBtn style={HighlightedPeriod === "5Y" ? { borderBottom: '2px solid Aqua' } : {}} onClick={() => { setHighlightedPeriod("5Y") }}>
                5Y
              </StockPeriodBtn>
              <StockPeriodBtn style={HighlightedPeriod === "ALL" ? { borderBottom: '2px solid Aqua' } : {}} onClick={() => { setHighlightedPeriod("ALL") }}>
                ALL
              </StockPeriodBtn>
            </ChartOptions>
          </ChartFlex>
          {/* Decouple these and make proper form and input components*/}
          <form onSubmit={handleSubmit}>
            {formInputs.map((input) => (
              <FormInput
                key={input.id}
                {...input}
                value={formValues[input.name]}
                onChange={onChange} />
            ))}
            <button>Submit</button>
          </form>
          <h1 id="Profit-Heading">{`Profitability for ${HighlightedPeriod}`}</h1>
          <h2 id="Profit" style={{ marginBottom: "2rem" }}>{`${Profit.toFixed(2)} x input money`}</h2>
          <h1 id="Stock-Status-Heading">Stock Status</h1>
          <h2 id="Stock-Status">{!InMarket ? "Out of the Market, Holding" : "In the Market, Holding"}</h2>
        </MainFlex>
      </main>
    </>
  )
}
/* 
Components:

  Main flex
  Input flex
  H1
  H2-Stats
  H2-Chart
  Chart
  Chart-Options

Possible Components:
  Input handlers
*/

/* 
            <span><p>Stock Ticker</p><input id="Stock-Ticker-Input" placeholder={StockName}/></span>
            <span><p>Query Interval</p>
              <label>
                <input id="Query-Interval-Input" list="Intervals" placeholder={QueryInterval}/>
              </label>
              <datalist id="Intervals">
                <option value="1m"/>
                <option value="2m"/>
                <option value="5m"/>
                <option value="15m"/>
                <option value="30m"/>
                <option value="90m"/>
                <option value="1h"/>
                <option value="1d"/>
                <option value="5d"/>
                <option value="1wk"/>
                <option value="1mo"/>
                <option value="3mo"/>
              </datalist>
            </span>
            <span><p>Upper Sell Target</p><input id="Upper-Sell-Input" placeholder={UpperSell}></input></span>
            <span><p>Lower Sell Target</p><input id="Lower-Sell-Input" placeholder={LowerSell}></input></span>
            <span><p>Initially Holding</p><input id="Initially-Holding-Input" placeholder={InitiallyHolding ? "Yes":"No"}></input></span>
            <span><p>Strategy</p><input id="Strategy-Input" placeholder={Strategy}></input></span>
            <span><p>Upper Indicator</p><input id="Upper-Indicator-Input" placeholder={UpperIndicator}></input></span>
            <span><p>Lower Indicator</p><input id="Lower-Indicator-Input" placeholder={LowerIndicator}></input></span>
*/