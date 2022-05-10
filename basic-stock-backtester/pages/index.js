import Head from 'next/head'
import Image from 'next/image'
import MainFlex from '../components/main-flex/main-flex.js'
import SubtitleFlex from '../components/subtitle-flex/subtitle-flex.js'
import InputFlex from '../components/input-flex/input-flex.js'
import ChartFlex from '../components/chart-flex/chart-flex.js'
import ChartOptions from '../components/chart-options/chart-options.js'
import { StockPeriodBtn } from '../components/chart-options/chart-options.elements.js'

import { Line } from 'react-chartjs-2'

import { useState } from 'react'
import faker from 'faker';
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


export default function Home() {
  const [HighlightedPeriod, setHighlightedPeriod] = useState("1D");
  const [Profit, setProfit] = useState(1);

  const [StockName, SetStockName] = useState("ETH-USD");
  const [QueryInterval, setQueryInterval] = useState("1m");
  const [UpperSell, SetUpperSell] = useState(1.1);
  const [LowerSell, SetLowerSell] = useState(.95);
  const [InitiallyHolding, SetInitiallyHolding] = useState(false);
  const [Strategy, SetStrategy] = useState("Conservative Momentum");
  const [UpperIndicator, SetUpperIndicator] = useState("EMA-24");
  const [LowerIndicator, SetLowerIndicator] = useState("EMA-12");

  const [InMarket, setInMarket] = useState(false); // if you are invested or not

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  };

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <>
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
            <h2 id="Stock-Name">{StockName}</h2>
            <h3 id="Upper-Sell-Target">{`Upper Sell Target: ${UpperSell}`}</h3>
            <h3 id="Lower-Sell-Target">{`Lower Sell Target: ${LowerSell}`}</h3>
          </SubtitleFlex>
          <ChartFlex>
            <Line
              options={options}
              data={data}
            />
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
          <InputFlex>
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
          </InputFlex>
          <h1 id="Profit-Heading">{`Profitability for ${HighlightedPeriod}`}</h1>
          <h2 id="Profit" style={{marginBottom:"2rem"}}>{`${Profit.toFixed(2)} x input money`}</h2>
          <h1 id="Stock-Status-Heading">Stock Status</h1>
          <h2 id="Stock-Status">{!InMarket ? "Out of the Market, Holding": "In the Market, Holding"}</h2>
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