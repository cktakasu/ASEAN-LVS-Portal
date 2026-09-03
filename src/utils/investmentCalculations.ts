export interface InvestmentModelAssumptions {
  initialInvestmentUsd: number;
  year0OperatingCostUsd: number;
  annualRevenueUsd: readonly number[];
  cogsRate: number;
  variableCostRate: number;
  annualFixedCostUsd: number;
  discountRate: number;
}

export interface CalculatedCashFlowYear {
  year: number;
  revenue: number;
  cogs: number;
  grossProfit: number;
  fixedCost: number;
  variableCost: number;
  operatingProfit: number;
  cumulativeCF: number;
}

export interface CalculatedInvestmentScenario {
  revenueMultiplier: number;
  cashFlow: CalculatedCashFlowYear[];
  breakEvenMonth: number | null;
  roi3YearPct: number;
  npv5YearUsd: number;
  irrPct: number | null;
}

const roundUsd = (value: number): number => Math.round(value);
const roundOneDecimal = (value: number): number => Math.round(value * 10) / 10;

export const calculateAnnualOperatingProfit = (
  revenueUsd: number,
  assumptions: Pick<
    InvestmentModelAssumptions,
    "cogsRate" | "variableCostRate" | "annualFixedCostUsd"
  >
): Omit<CalculatedCashFlowYear, "year" | "cumulativeCF"> => {
  const revenue = roundUsd(revenueUsd);
  const cogs = roundUsd(revenue * assumptions.cogsRate);
  const variableCost = roundUsd(revenue * assumptions.variableCostRate);
  const grossProfit = revenue - cogs;
  const fixedCost = assumptions.annualFixedCostUsd;
  const operatingProfit = grossProfit - fixedCost - variableCost;

  return { revenue, cogs, grossProfit, fixedCost, variableCost, operatingProfit };
};

export const calculateCashFlow = (
  assumptions: InvestmentModelAssumptions,
  revenueMultiplier = 1
): CalculatedCashFlowYear[] => {
  let cumulativeCF = -assumptions.initialInvestmentUsd - assumptions.year0OperatingCostUsd;
  const year0OperatingProfit = assumptions.year0OperatingCostUsd === 0
    ? 0
    : -assumptions.year0OperatingCostUsd;
  const years: CalculatedCashFlowYear[] = [
    {
      year: 0,
      revenue: 0,
      cogs: 0,
      grossProfit: 0,
      fixedCost: assumptions.year0OperatingCostUsd,
      variableCost: 0,
      operatingProfit: year0OperatingProfit,
      cumulativeCF,
    },
  ];

  assumptions.annualRevenueUsd.forEach((baseRevenue, index) => {
    const annual = calculateAnnualOperatingProfit(baseRevenue * revenueMultiplier, assumptions);
    cumulativeCF += annual.operatingProfit;
    years.push({ year: index + 1, ...annual, cumulativeCF });
  });

  return years;
};

export const calculateBreakEvenMonth = (
  cashFlow: readonly CalculatedCashFlowYear[]
): number | null => {
  const year0 = cashFlow.find((row) => row.year === 0);
  if (!year0) return null;
  if (year0.cumulativeCF >= 0) return 0;

  let previousCumulative = year0.cumulativeCF;
  for (const row of cashFlow.filter((item) => item.year > 0)) {
    if (row.operatingProfit > 0 && row.cumulativeCF >= 0) {
      const fractionOfYear = -previousCumulative / row.operatingProfit;
      return (row.year - 1) * 12 + Math.ceil(fractionOfYear * 12);
    }
    previousCumulative = row.cumulativeCF;
  }

  return null;
};

export const calculateNpv = (
  initialOutflowUsd: number,
  annualCashFlowsUsd: readonly number[],
  discountRate: number
): number =>
  annualCashFlowsUsd.reduce(
    (npv, cashFlow, index) => npv + cashFlow / (1 + discountRate) ** (index + 1),
    -initialOutflowUsd
  );

export const calculateIrr = (
  initialOutflowUsd: number,
  annualCashFlowsUsd: readonly number[]
): number | null => {
  const npvAt = (rate: number): number =>
    calculateNpv(initialOutflowUsd, annualCashFlowsUsd, rate);

  let low = -0.9999;
  let high = 10;
  if (npvAt(low) * npvAt(high) > 0) return null;

  for (let iteration = 0; iteration < 200; iteration += 1) {
    const midpoint = (low + high) / 2;
    if (npvAt(midpoint) > 0) {
      low = midpoint;
    } else {
      high = midpoint;
    }
  }

  return (low + high) / 2;
};

export const calculateInvestmentScenario = (
  assumptions: InvestmentModelAssumptions,
  revenueMultiplier: number
): CalculatedInvestmentScenario => {
  const cashFlow = calculateCashFlow(assumptions, revenueMultiplier);
  const annualOperatingCash = cashFlow
    .filter((row) => row.year > 0)
    .map((row) => row.operatingProfit);
  const initialOutflow = assumptions.initialInvestmentUsd + assumptions.year0OperatingCostUsd;
  const year3Cumulative = cashFlow.find((row) => row.year === 3)?.cumulativeCF ?? -initialOutflow;
  const irr = calculateIrr(initialOutflow, annualOperatingCash);

  return {
    revenueMultiplier,
    cashFlow,
    breakEvenMonth: calculateBreakEvenMonth(cashFlow),
    roi3YearPct: roundOneDecimal((year3Cumulative / initialOutflow) * 100),
    npv5YearUsd: roundUsd(
      calculateNpv(initialOutflow, annualOperatingCash.slice(0, 5), assumptions.discountRate)
    ),
    irrPct: irr === null ? null : roundOneDecimal(irr * 100),
  };
};
