/* ------------------------------------------------------------------------ */
/*  Solvency calculator: projects OASI trust‑fund income, cost and assets   */
/*  now includes sliders for benefit‑tax inclusion rates (middle / upper)   */
/* ------------------------------------------------------------------------ */

import {
  /* --- SSA baseline arrays & macro params --- */
  baselineIncome,
  baselineCost,
  baselineAssets,
  payroll2024,
  payrollGrowth,

  /* --- payroll‑side coefficients --- */
  coeffCombinedRate,
  coeffSingleSideRate,
  coeffWageShareEmp,

  /* --- cost‑side coefficients --- */
  coeffFRA_1yr,
  coeffChainedCPI,
  coeffPPI_10ppt,

  /* --- immigration coefficient & ramp --- */
  coeffImmig1M,
  ramp,

  /* --- benefit‑tax constants & helper --- */
  sharePayrollMiddle,
  sharePayrollUpper,
  includeMiddle0,
  includeUpper0,
  BENEFIT_TAX_MTR,
  benefitTaxDelta,

  /* --- types --- */
  SimulatorInputs,
  CapOption
} from './solvency-constants';

/* ---------- result types ---------- */
export interface YearlyResults {
  year: number;
  income: number;      // payroll tax + benefit tax + interest + equity + GR
  cost: number;
  surplus: number;
  assets: number;
  monthsReserve: number;
}
export interface SimulationResults {
  yearlyData: YearlyResults[];
  depletionYear: number | null;
}

/* ---------- helper functions ---------- */
function getWageGainPct(opt: CapOption, custom: number): number {
  switch (opt) {
    case 'status quo': return 0;
    case '+50 %':      return 7;
    case '+75 %':      return 9;
    case '+100 %':     return 11;
    case '+200 %':     return 14;
    case 'No cap':     return 17;
    case 'Custom %':   return custom;
    default:           return 0;
  }
}
function phaseIn(cur: number, start: number, impl?: number): number {
  if (!impl || impl <= start) return 1;
  return cur >= impl ? 1 : (cur - start) / (impl - start);
}

/* ==============  MAIN ENGINE  ============== */
export function runSimulation(inputs: SimulatorInputs): SimulationResults {
  /* trust‑fund parameters */
  const INTEREST_RATE_TSY = 0.04;  // special‑issue Treasuries
  const RETURN_EQUITY     = 0.09;  // nominal equity assumption

  /* pre‑compute 2033 payroll‑tax ratio (benefit tax & interest removed) */
  const payroll2033  = payroll2024 * Math.pow(1 + payrollGrowth, 2033 - 2024);
  const interest2033 = baselineAssets[baselineAssets.length - 1] * INTEREST_RATE_TSY;
  const benefit2033  = BENEFIT_TAX_MTR *
      (sharePayrollMiddle * includeMiddle0 + sharePayrollUpper * includeUpper0) *
      payroll2033;
  const taxIncome2033 = baselineIncome[baselineIncome.length - 1]
                      - interest2033 - benefit2033;
  const taxRatio2033  = taxIncome2033 / payroll2033;
  const costRatio2033 = baselineCost [baselineCost .length - 1] / payroll2033;

  /* initialise 2024 asset sleeves (optionally shift some to equities) */
  const equityShift = inputs.equityShiftB || 0;                 // $ B
  let equityPrincipalPrev = equityShift;
  let treasuryAssetsPrev  = Math.max(0, baselineAssets[0] - equityShift);

  /* loop state */
  const yearlyData: YearlyResults[] = [];
  let depletionYear: number | null = null;
  let year = 2024;
  let idx  = 0;  // index into SSA rows through 2033

  while (year <= 2075 && (equityPrincipalPrev + treasuryAssetsPrev) > 0) {

    /* ----- payroll base this year ----- */
    const payroll = payroll2024 * Math.pow(1 + payrollGrowth, year - 2024);

    /* ----- baseline benefit-tax every year (≈0.42% of payroll) ----- */
    const baseBenefitTaxSSA =
      BENEFIT_TAX_MTR *
      (sharePayrollMiddle * includeMiddle0 + sharePayrollUpper * includeUpper0) *
      payroll;

    /* ----- split SSA row into payroll-tax only vs. post-2033 proxy ----- */
    let baseTaxIncome: number;
    if (idx < baselineIncome.length) {
      // SSA’s rows include both payroll tax + benefit-tax in baselineIncome[idx]
      baseTaxIncome = baselineIncome[idx] - baseBenefitTaxSSA;
    } else {
      // after 2033 we model *only* payroll tax via the precomputed ratio
      baseTaxIncome = taxRatio2033 * payroll;
    }

    /* ----- baseline cost ----- */
    const baseCost =
      idx < baselineCost.length
        ? baselineCost[idx]
        : costRatio2033 * payroll;

    /* ----- interest on the trust-fund sleeves ----- */
    const treasuryInterest = idx < baselineIncome.length
      ? 0
      : treasuryAssetsPrev * INTEREST_RATE_TSY;
    const equityReturn = equityPrincipalPrev * RETURN_EQUITY;

    /* ---------- income adjustments (policy levers) ---------- */
    const rateIncCombined = inputs.combinedTaxStep      * phaseIn(year, 2024, inputs.combinedTaxImplementYear)      / 0.1;
    const rateIncEmpOnly  = inputs.empTaxOnlyStep       * phaseIn(year, 2024, inputs.empTaxOnlyImplementYear)       / 0.1;
    const rateIncEmprOnly = (inputs.employerTaxOnlyStep || 0) *
                            phaseIn(year, 2024, inputs.employerTaxOnlyImplementYear || 2040) / 0.1;
    const rateIncEmpSur   = inputs.employerSurcharge    * phaseIn(year, 2024, inputs.employerSurchargeImplementYear) / 0.1;

    const incRateBump =
        (rateIncCombined * coeffCombinedRate +
         rateIncEmpOnly  * coeffSingleSideRate +
         rateIncEmprOnly * coeffSingleSideRate +
         rateIncEmpSur   * coeffSingleSideRate) * payroll;

    const currentWageGainPct = getWageGainPct(inputs.empCapOption, inputs.customCapPct) *
                               phaseIn(year, 2024, inputs.empCapImplementYear);
    const incCapLift = (currentWageGainPct / 5) * coeffWageShareEmp * payroll;

    const incImmig  = inputs.immigBoostM * coeffImmig1M * payroll;
    const incGenRev = inputs.genRevTransferB;

    /* ----- benefit‑tax slider delta ----- */
    const adjMiddle = (inputs.middleIncludePct ?? 50) / 100;
    const adjUpper  = (inputs.upperIncludePct  ?? 85) / 100;
    const benefitTaxDelta$ = benefitTaxDelta(payroll, adjMiddle, adjUpper);
    const benefitTax = baseBenefitTaxSSA + benefitTaxDelta$;

    /* ----- total income this year ----- */
    const newIncome =
      baseTaxIncome +
      benefitTax +
      treasuryInterest +
      equityReturn +
      incRateBump +
      incCapLift +
      incImmig +
      incGenRev;

    /* ---------- cost adjustments ---------- */
    const costFRA   = -inputs.fraYearsUp   * phaseIn(year, 2024, inputs.fraImplementYear)        * coeffFRA_1yr   * payroll;
    const costChCPI = -(inputs.chainedCPIflag ? 1 : 0) * phaseIn(year, 2024, inputs.chainedCPIImplementYear) * coeffChainedCPI * payroll;
    const costPPI   = -(inputs.ppiCoveragePct / 10)    * phaseIn(year, 2024, inputs.ppiImplementYear)        * coeffPPI_10ppt * payroll;
    const newCost   = baseCost + costFRA + costChCPI + costPPI;

    /* ---------- update trust‑fund sleeves ---------- */
    const surplus = newIncome - newCost;
    equityPrincipalPrev += equityReturn;                   // reinvest
    treasuryAssetsPrev  = Math.max(0, treasuryAssetsPrev + surplus);

    const totalAssets   = equityPrincipalPrev + treasuryAssetsPrev;
    const monthsReserve = totalAssets > 0 ? (totalAssets / newCost) * 12 : 0;

    yearlyData.push({ year, income: newIncome, cost: newCost,
                      surplus, assets: totalAssets, monthsReserve });

    if (totalAssets === 0 && depletionYear === null) depletionYear = year;

    /* advance one year */
    year += 1;
    idx  += 1;
  }

  return { yearlyData, depletionYear };
}
