// react imports
import { useState, useEffect } from 'react'
// API imports
import { getChartData} from '../src/infrastructure/api/chartData.js'
// Component imports
import Head from 'next/head'
import ChartOptions from '../src/presentation/components/chartOptions/chartOptions.js'
import { StockPeriodBtn } from '../src/presentation/components/chartOptions/chartOptions.elements.js'
import FormInput from '../src/presentation/components/formInput/formInput.js'
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
import { formInputs, chartStockPeriods, options, chartData } from '../src/infrastructure/content/homeContent.js'

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
  const [HighlightedPeriod, setHighlightedPeriod] = useState("1D");
  const [Profit, setProfit] = useState(1);
  const [InMarket, setInMarket] = useState(false); // if you are invested or not

  const [APIData, setAPIData] = useState(null)

  useEffect(() => {
    getChartData(
      "ETH-USD",
      "1D",
      "1Y",
      "1.10",
      ".95",
      "False",
      "ConservativeMomentum",
      "EMA-12",
      "EMA-24", 
      res => {
        console.log(res)
      }, err => {
        alert(err)
      })
  }, [])

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

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const onChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  // Todo: Get the Chart data from the Python Flask API
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
              data={chartData}
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
          <h2 id="Stock-Status">{!InMarket ? "Out of the Market, Holding" : "In the Market, Holding"}</h2>
        </section>
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
  chart
  stats

*/