"use client";
import Chart, { ChartItem, TooltipItem } from "chart.js/auto";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { stocksList } from "../../../public/stocks-list";
import "./stock-calculator.css";

interface FormData {
  portfolioSize: number;
  symbolName: string;
  maxPercentLoss: number;
  entryPrice: number;
  stopExitPrice: number;
  targetPrice: number;
}

const StockCalculator: React.FC = () => {
  const chartRef = useRef<Chart | null>(null);

  const [formData, setFormData] = useState<FormData>({
    portfolioSize: 150000,
    symbolName: "AC",
    maxPercentLoss: 9,
    entryPrice: 115.54,
    stopExitPrice: 88.1,
    targetPrice: 150,
  });

  const [userReadyToTakePercentLoss, setUserReadyToTakePercentLoss] =
    useState<number>(0);
  const [costOfTrade, setCostOfTrade] = useState<number>(0);
  const [sharesCanBeBought, setSharesCanBeBought] = useState<number>(0);
  const [maxLoss, setMaxLoss] = useState<number>(0);
  const [maxLossInPercentage, setMaxLossInPercentage] = useState<number>(0);
  const [maxGain, setMaxGain] = useState<number>(0);
  const [profitTarget, setProfitTarget] = useState<number>(0);
  const [profitTargetPercentage, setProfitTargetPercentage] =
    useState<number>(0);

  const userReadyToTakeLossInPercentage = useCallback(
    (portfolioSize: number, maxPercentLoss: number): number => {
      return ((maxPercentLoss / 100) * portfolioSize) / 100;
    },
    []
  );

  const calculateMaxLoss = useCallback(
    (entryPrice: number, stopExitPrice: number): number => {
      return Number((entryPrice - stopExitPrice).toFixed(2));
    },
    []
  );

  const calculateMaxGain = useCallback(
    (targetPrice: number, entryPrice: number): number => {
      return Number((targetPrice - entryPrice).toFixed(2));
    },
    []
  );

  const calculateMaxLossInPercentage = useCallback(
    (maxLoss: number, entryPrice: number): number => {
      return Number(((maxLoss / entryPrice) * 100).toFixed(2));
    },
    []
  );

  const calculateSharesToBeBought = useCallback(
    (percentageMaxLoss: number, maxLoss: number): number => {
      return Number((percentageMaxLoss / maxLoss).toFixed(0));
    },
    []
  );

  const calculateCostOfTrade = useCallback(
    (entryPrice: number, sharesCanBeBought: number): number => {
      return entryPrice * sharesCanBeBought;
    },
    []
  );

  const calculateProfitTarget = useCallback(
    (maxGain: number, sharesCanBeBought: number): number => {
      return maxGain * sharesCanBeBought;
    },
    []
  );

  const calculateProfitTargetPercentage = useCallback(
    (targetPrice: number, entryPrice: number): number => {
      return Number(
        (((targetPrice - entryPrice) / entryPrice) * 100).toFixed(2)
      );
    },
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const readyToTakeLossInPercent = userReadyToTakeLossInPercentage(
      formData.portfolioSize,
      formData.maxPercentLoss
    );
    setUserReadyToTakePercentLoss(readyToTakeLossInPercent);

    const calculatedMaxLoss = calculateMaxLoss(
      formData.entryPrice,
      formData.stopExitPrice
    );
    setMaxLoss(calculatedMaxLoss);

    const calculatedSharesToBeBought = calculateSharesToBeBought(
      readyToTakeLossInPercent,
      calculatedMaxLoss
    );
    setSharesCanBeBought(calculatedSharesToBeBought);

    const calculatedCostOfTrade = calculateCostOfTrade(
      formData.entryPrice,
      calculatedSharesToBeBought
    );
    setCostOfTrade(calculatedCostOfTrade);

    const calculatedMaxGain = calculateMaxGain(
      formData.targetPrice,
      formData.entryPrice
    );
    setMaxGain(calculatedMaxGain);

    const calculatedMaxLossInPercentage = calculateMaxLossInPercentage(
      calculatedMaxGain,
      formData.entryPrice
    );
    setMaxLossInPercentage(calculatedMaxLossInPercentage);

    const calculatedProfitTarget = calculateProfitTarget(
      calculatedMaxGain,
      calculatedSharesToBeBought
    );
    setProfitTarget(calculatedProfitTarget);

    const calculatedProfitTargetPercentage = calculateProfitTargetPercentage(
      formData.targetPrice,
      formData.entryPrice
    );
    setProfitTargetPercentage(calculatedProfitTargetPercentage);
  };

  useEffect(() => {
    const calculatedSharesToBeBought = calculateSharesToBeBought(
      userReadyToTakePercentLoss,
      maxLoss
    );
    setSharesCanBeBought(calculatedSharesToBeBought);

    const calculatedCostOfTrade = calculateCostOfTrade(
      formData.entryPrice,
      calculatedSharesToBeBought
    );
    setCostOfTrade(calculatedCostOfTrade);
  }, [
    userReadyToTakePercentLoss,
    maxLoss,
    formData.entryPrice,
    calculateSharesToBeBought,
    calculateCostOfTrade,
  ]);

  useEffect(() => {
    if (maxGain > 0 && maxLoss > 0) {
      createChart(maxGain, maxLoss);
    }
  }, [maxGain, maxLoss]);

  const createChart = (maxGain: number, maxLoss: number) => {
    const data = [
      { label: "Max loss", value: maxLoss },
      { label: "Max gain", value: maxGain },
    ];

    const chartContext = document.getElementById("acquisitions") as ChartItem;
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    if (chartContext) {
      chartRef.current = new Chart<any>(chartContext, {
        type: "doughnut",
        data: {
          labels: data.map((row) => row.label),
          datasets: [
            {
              data: data.map((row) => row.value),
              borderColor: "#f3837796",
              backgroundColor: ["#f38989", "#78c1a3"],
            },
          ],
        },
      });
    }
  };

  const {
    portfolioSize,
    symbolName,
    maxPercentLoss,
    entryPrice,
    stopExitPrice,
    targetPrice,
  } = formData;

  return (
    <div className="container-fluid main-container">
      <div className="row full-height d-flex align-items-center justify-content-center mb-4">
        <div className="col-6 text-center">
          <p className="mb-0 heading-1">Stock Calculator</p>
        </div>
      </div>
      <hr />
      <div className="row mt-4 mb-4">
        <div className="col-12 col-md-6">
          <Form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-12 col-md-6">
                <Form.Group className="mb-3" controlId="formPortfolioSize">
                  <label htmlFor="portfolioSize" className="lbl-white mb-3">
                    Enter your portfiolo size
                  </label>
                  <Form.Control
                    type="number"
                    name="portfolioSize"
                    placeholder="Portfolio size"
                    value={portfolioSize}
                    onChange={handleChange}
                    className="styled-input"
                  />
                </Form.Group>
              </div>
              <div className="col-12 col-md-6">
                <Form.Group className="mb-3" controlId="symbolName">
                  <label htmlFor="symbolName" className="lbl-white mb-3">
                    Enter symbol name
                  </label>
                  <Form.Control
                    type="text"
                    name="symbolName"
                    placeholder="Symbol name"
                    value={symbolName}
                    onChange={handleChange}
                    list="symbols"
                    className="styled-input"
                  />
                  <datalist id="symbols">
                    {stocksList.map((symbol, index) => (
                      <option key={index} value={symbol} />
                    ))}
                  </datalist>
                </Form.Group>
              </div>
            </div>

            <div className="row mb-3 mt-3">
              <div className="col-12 col-md-6">
                <Form.Group className="mb-3" controlId="maxPercentLoss">
                  <label htmlFor="maxPercentLoss" className="lbl-white mb-3">
                    Enter maximum percentage loss
                  </label>
                  <Form.Control
                    type="number"
                    name="maxPercentLoss"
                    placeholder="Maximum ercentage loss"
                    value={maxPercentLoss}
                    onChange={handleChange}
                    className="styled-input"
                  />
                </Form.Group>
              </div>
              <div className="col-12 col-md-6">
                <Form.Group className="mb-3" controlId="entryPrice">
                  <label htmlFor="entryPrice" className="lbl-white mb-3">
                    Enter your entry price
                  </label>
                  <Form.Control
                    type="number"
                    name="entryPrice"
                    placeholder="Entry price"
                    value={entryPrice}
                    onChange={handleChange}
                    className="styled-input"
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row mb-3 mt-3">
              <div className="col-12 col-md-6">
                <Form.Group className="mb-3" controlId="stopExitPrice">
                  <label htmlFor="stopExitPrice" className="lbl-white mb-3">
                    Enter stop loss price
                  </label>
                  <Form.Control
                    type="number"
                    name="stopExitPrice"
                    placeholder="Stop loss"
                    value={stopExitPrice}
                    onChange={handleChange}
                    className="styled-input"
                  />
                </Form.Group>
              </div>
              <div className="col-12 col-md-6">
                <Form.Group className="mb-3" controlId="targetPrice">
                  <label htmlFor="targetPrice" className="lbl-white mb-3">
                    Enter target price
                  </label>
                  <Form.Control
                    type="number"
                    name="targetPrice"
                    placeholder="Target price"
                    value={targetPrice}
                    onChange={handleChange}
                    className="styled-input"
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Button
                  variant="primary"
                  className="submit-button button-5"
                  type="submit">
                  Calculate
                </Button>
              </div>
            </div>
          </Form>
        </div>
        <div className="col-12 chart-container col-md-6">
          <canvas id="acquisitions" className="chart"></canvas>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col">
          <table className="table table-sm my-table mt-4 sticky-footer">
            <thead>
              <tr>
                <th scope="col">Max Loss per position:</th>
                <th scope="col">Cost of trade:</th>
                <th scope="col">Max Loss:</th>
                <th scope="col">Max Loss %:</th>
                <th scope="col">Max Gain:</th>
                <th scope="col">Shares can be bought:</th>
                <th scope="col">Profit target:</th>
                <th scope="col">Profit target %:</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{userReadyToTakePercentLoss}</td>
                <td>{costOfTrade}</td>
                <td>{maxLoss}</td>
                <td>{maxLossInPercentage}</td>
                <td>{maxGain}</td>
                <td>{profitTarget}</td>
                <td>{sharesCanBeBought}</td>
                <td>{profitTargetPercentage}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockCalculator;
