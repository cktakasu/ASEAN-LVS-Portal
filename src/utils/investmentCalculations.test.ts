import { describe, expect, it } from "vitest";
import {
  calculateAnnualOperatingProfit,
  calculateInvestmentScenario,
  calculateNpv,
  type InvestmentModelAssumptions,
} from "./investmentCalculations";

const assumptions: InvestmentModelAssumptions = {
  initialInvestmentUsd: 380000,
  year0OperatingCostUsd: 0,
  annualRevenueUsd: [600000, 900000, 1400000, 1900000, 2400000],
  cogsRate: 0.55,
  variableCostRate: 0.08,
  annualFixedCostUsd: 220000,
  discountRate: 0.1,
};

describe("investment calculations", () => {
  it("derives annual operating profit from shared cost assumptions", () => {
    expect(calculateAnnualOperatingProfit(600000, assumptions)).toEqual({
      revenue: 600000,
      cogs: 330000,
      grossProfit: 270000,
      fixedCost: 220000,
      variableCost: 48000,
      operatingProfit: 2000,
    });
  });

  it("keeps Year 0 and cumulative cash flow internally consistent", () => {
    const result = calculateInvestmentScenario(assumptions, 1);

    expect(result.cashFlow.map((row) => row.operatingProfit)).toEqual([
      0, 2000, 113000, 298000, 483000, 668000,
    ]);
    expect(result.cashFlow.map((row) => row.cumulativeCF)).toEqual([
      -380000, -378000, -265000, 33000, 516000, 1184000,
    ]);
  });

  it("calculates base-case ROI, NPV, IRR and break-even month", () => {
    const result = calculateInvestmentScenario(assumptions, 1);

    expect(result.roi3YearPct).toBe(8.7);
    expect(result.npv5YearUsd).toBe(683769);
    expect(result.irrPct).toBe(43.6);
    expect(result.breakEvenMonth).toBe(35);
    expect(calculateNpv(380000, [2000, 113000, 298000, 483000, 668000], 0.1))
      .toBeCloseTo(683769.36, 2);
  });

  it.each([
    ["optimistic", 1.3, 27, 93.4, 1253092, 66.4],
    ["base", 1, 35, 8.7, 683769, 43.6],
    ["pessimistic", 0.7, 49, -76, 114447, 16.4],
  ] as const)("calculates the %s scenario from the same assumptions", (
    _name,
    multiplier,
    breakEvenMonth,
    roi3YearPct,
    npv5YearUsd,
    irrPct
  ) => {
    const result = calculateInvestmentScenario(assumptions, multiplier);

    expect(result.breakEvenMonth).toBe(breakEvenMonth);
    expect(result.roi3YearPct).toBe(roi3YearPct);
    expect(result.npv5YearUsd).toBe(npv5YearUsd);
    expect(result.irrPct).toBe(irrPct);
  });
});
