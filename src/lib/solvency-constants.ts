// Baseline data
export const baselineYears = [2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033];
export const baselineIncome = [1192.6, 1224.8, 1291.3, 1348.8, 1410.6, 1472.6, 1535.1, 1599.7, 1665.1, 1732.3]; // billions, includes interest
export const baselineCost = [1323.0, 1405.4, 1485.1, 1570.0, 1660.6, 1753.3, 1847.9, 1943.7, 2040.5, 2138.2]; // billions
export const baselineAssets = [2511.1, 2330.5, 2136.6, 1915.4, 1665.4, 1384.7, 1071.9, 727.9, 352.5, 0]; // billions
export const payroll2024 = 9700; // billions taxable payroll 2024
export const payrollGrowth = 0.0375; // 3.75% nominal annual payroll growth

// Coefficients
export const coeffCombinedRate = 0.00099; // Δ income (%‑payroll) per 0.1 ppt combined tax ↑
export const coeffSingleSideRate = 0.00050; // employer‑only or employee‑only per 0.1 ppt ↑
export const coeffWageShareEmp = 0.0038; // Δ income per 5 ppt extra wage base (employee side)
export const coeffFRA_1yr = 0.0030; // – cost (%‑payroll) long‑run per 1 yr FRA ↑
export const coeffChainedCPI = 0.0040; // – cost if chained‑CPI flag = 1
export const coeffPPI_10ppt = 0.0011; // – cost per 10 % of earners hit by price‑indexing
export const coeffImmig1M = 0.0013; // + income per +1 M net workers/yr after 5 yr ramp
export const coeffEquity100B = 0.00009; // + income (interest) per $100 B shifted to equities
export const usdPer0_1pctPayroll = 11; // $ B in 2030 for each 0.1 % payroll

export const sharePayrollMiddle = 0.11;   // wages whose benefits fall in middle band
export const sharePayrollUpper  = 0.05;   // wages whose benefits fall in top band
// 0.11 + 0.05 ≈ 0.16 ⇒ matches SSA’s 0.42 %‑of‑payroll benefit tax today

export const includeMiddle0 = 0.50;       // 50 % inclusion now
export const includeUpper0  = 0.85;       // 85 % inclusion now

// Helper for immigration ramp
export const ramp = (year: number): number => {
  const yearIndex = baselineYears.indexOf(year);
  if (yearIndex === -1) return 0;
  
  const rampFactors = [0.5, 0.6, 0.75, 0.9, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
  return rampFactors[yearIndex] || 1.0;
};

// Format number as money
export const formatCurrency = (value: number): string => {
  return `$${value.toFixed(1)}B`;
};

// Format as percentage
export const formatPercent = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

export const BENEFIT_TAX_MTR = 0.15;      // avg marginal tax retirees pay
/* helper to turn an inclusion change into $‑billions */
export const benefitTaxDelta = (
  payroll: number,
  incMid: number,
  incTop: number
): number => {
  const Δmiddle = (incMid - includeMiddle0) * sharePayrollMiddle * payroll;
  const Δupper  = (incTop - includeUpper0)  * sharePayrollUpper  * payroll;
  return BENEFIT_TAX_MTR * (Δmiddle + Δupper);   // dollars
};

// Define the possible options for the employer wage base cap
export type CapOption =
  | "status quo"
  | "+50 %"
  | "+75 %"
  | "+100 %"
  | "+200 %"
  | "No cap"
  | "Custom %";

export interface SimulatorInputs {
  combinedTaxStep: number;
  empTaxOnlyStep: number;
  empCapOption: CapOption;
  customCapPct: number;
  fraYearsUp: number;
  employerTaxOnlyStep: number;
  employerTaxOnlyImplementYear: number;
  chainedCPIflag: boolean;
  ppiCoveragePct: number;
  immigBoostM: number;
  equityShiftB: number;
  employerSurcharge: number;
  genRevTransferB: number;
  combinedTaxImplementYear: number;
  empTaxOnlyImplementYear: number;
  empCapImplementYear: number;
  employerSurchargeImplementYear: number;
  fraImplementYear: number;
  chainedCPIImplementYear: number;
  ppiImplementYear: number;
  middleIncludePct: number; 
upperIncludePct:  number;  
}
