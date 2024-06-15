"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { stocksList } from "../../../public/stocks-list";

interface FormData {
  portfolioSize: number;
  symbolName: string;
  maxPercentLoss: number;
  entryPrice: number;
  stopExitPrice: number;
  targetPrice: number;
}

const StockCalculator: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    portfolioSize: 150000,
    symbolName: "AC",
    maxPercentLoss: 914,
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

  const {
    portfolioSize,
    symbolName,
    maxPercentLoss,
    entryPrice,
    stopExitPrice,
    targetPrice,
  } = formData;

  return (
    <div className="container-fluid bg-light">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formPortfolioSize">
          <Form.Control
            type="number"
            name="portfolioSize"
            placeholder="Enter portfolio size"
            value={portfolioSize}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="symbolName">
          <Form.Control
            type="text"
            name="symbolName"
            placeholder="Enter symbol name"
            value={symbolName}
            onChange={handleChange}
            list="symbols"
          />
          <datalist id="symbols">
            {stocksList.map((symbol, index) => (
              <option key={index} value={symbol} />
            ))}
          </datalist>
        </Form.Group>
        <Form.Group className="mb-3" controlId="maxPercentLoss">
          <Form.Control
            type="number"
            name="maxPercentLoss"
            placeholder="Enter maximum percentage loss"
            value={maxPercentLoss}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="entryPrice">
          <Form.Control
            type="number"
            name="entryPrice"
            placeholder="Enter entry price"
            value={entryPrice}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="stopExitPrice">
          <Form.Control
            type="number"
            name="stopExitPrice"
            placeholder="Enter stop loss price"
            value={stopExitPrice}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="targetPrice">
          <Form.Control
            type="number"
            name="targetPrice"
            placeholder="Enter target price"
            value={targetPrice}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      <div>
        <p>
          <strong> Max Loss per position:</strong> {userReadyToTakePercentLoss}
        </p>
        <p>
          <strong> Cost of trade:</strong> {costOfTrade}
        </p>
        <p>
          <strong> Max Loss:</strong> {maxLoss}
        </p>
        <p>
          <strong> Max Loss %:</strong> {maxLossInPercentage}
        </p>
        <p>
          <strong> Max Gain:</strong> {maxGain}
        </p>
        <p>
          <strong> Shares can be bought:</strong> {sharesCanBeBought}
        </p>
        <p>
          <strong>Profit target:</strong> {profitTarget}
        </p>
        <p>
          <strong>Profit target %:</strong> {profitTargetPercentage}
        </p>
      </div>
    </div>
  );
};

export default StockCalculator;
