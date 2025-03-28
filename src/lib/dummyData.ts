import { formatCurrency } from "./utils";

export interface Position {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  pnl: number;
  pnlPercentage: number;
  dailyPnL: number;
  dailyPnLPercentage: number;
  volume: number;
  openInterest: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  impliedVolatility: number;
  realizedVolatility: number;
  beta: number;
  correlation: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  var95: number;
  var99: number;
  expectedShortfall: number;
  stressTestLoss: number;
  scenarioAnalysis: {
    worstCase: number;
    baseCase: number;
    bestCase: number;
  };
  todayChange?: number;
  todayChangePercent?: number;
  costBasis?: number;
  allocation?: number;
  sector?: string;
  region?: string;
  riskScore?: number;
  lastUpdate?: string | Date;
}

const symbols = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "WMT", name: "Walmart Inc." },
];

function generateRandomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateRandomBoolean(): boolean {
  return Math.random() > 0.5;
}

function generatePosition(): Position {
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  const quantity = Math.floor(generateRandomNumber(100, 10000));
  const avgPrice = generateRandomNumber(50, 500);
  const currentPrice = avgPrice * generateRandomNumber(0.8, 1.2);
  const marketValue = quantity * currentPrice;
  const pnl = (currentPrice - avgPrice) * quantity;
  const pnlPercentage = (currentPrice - avgPrice) / avgPrice * 100;
  const dailyPnL = pnl * generateRandomNumber(-0.05, 0.05);
  const dailyPnLPercentage = pnlPercentage * generateRandomNumber(-0.1, 0.1);

  return {
    id: Math.random().toString(36).substr(2, 9),
    symbol: symbol.symbol,
    name: symbol.name,
    quantity,
    avgPrice,
    currentPrice,
    marketValue,
    pnl,
    pnlPercentage,
    dailyPnL,
    dailyPnLPercentage,
    volume: Math.floor(generateRandomNumber(1000000, 10000000)),
    openInterest: Math.floor(generateRandomNumber(500000, 5000000)),
    delta: generateRandomNumber(-1, 1),
    gamma: generateRandomNumber(-0.1, 0.1),
    theta: generateRandomNumber(-100, 100),
    vega: generateRandomNumber(-50, 50),
    impliedVolatility: generateRandomNumber(0.1, 0.5),
    realizedVolatility: generateRandomNumber(0.1, 0.5),
    beta: generateRandomNumber(0.5, 1.5),
    correlation: generateRandomNumber(-1, 1),
    sharpeRatio: generateRandomNumber(-2, 2),
    sortinoRatio: generateRandomNumber(-2, 2),
    maxDrawdown: generateRandomNumber(-0.1, -0.3),
    var95: generateRandomNumber(-1000, -5000),
    var99: generateRandomNumber(-2000, -10000),
    expectedShortfall: generateRandomNumber(-1500, -7500),
    stressTestLoss: generateRandomNumber(-5000, -20000),
    scenarioAnalysis: {
      worstCase: generateRandomNumber(-10000, -50000),
      baseCase: generateRandomNumber(-5000, 5000),
      bestCase: generateRandomNumber(5000, 10000),
    },
  };
}

export function generatePositions(count: number = 10): Position[] {
  return Array.from({ length: count }, generatePosition);
}

export function formatPositionValue(value: number | undefined | null, type: 'currency' | 'percentage' | 'number' = 'number'): string {
  if (value === undefined || value === null) {
    return '-';
  }
  
  if (type === 'currency') {
    return formatCurrency(value);
  } else if (type === 'percentage') {
    return `${value.toFixed(2)}%`;
  }
  return value.toFixed(2);
}

export function getPnLColor(value: number): string {
  return value >= 0 ? 'text-green-500' : 'text-red-500';
}

export function getPnLBackgroundColor(value: number): string {
  return value >= 0 ? 'bg-green-500/10' : 'bg-red-500/10';
} 