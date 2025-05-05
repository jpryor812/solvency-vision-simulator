import {
  baselineYears,
  baselineIncome,
  baselineCost,
  baselineAssets,
  payroll2024,
  payrollGrowth,
  coeffCombinedRate,
  coeffSingleSideRate,
  coeffWageShareEmp,
  coeffFRA_1yr,
  coeffChainedCPI,
  coeffPPI_10ppt,
  coeffImmig1M,
  coeffEquity100B,
  ramp,
  SimulatorInputs,
  CapOption
} from './solvency-constants';

export interface YearlyResults {
  year: number;
  income: number;
  cost: number;
  surplus: number;
  assets: number;
  monthsReserve: number;
}

export interface SimulationResults {
  yearlyData: YearlyResults[];
  depletionYear: number | null;
}

export function getWageGainPct(empCapOption: CapOption, customCapPct: number): number {
  switch (empCapOption) {
    case "status quo": return 0;
    case "+50 %": return 7;
    case "+100 %": return 11;
    case "No cap": return 17;
    case "Custom %": return customCapPct;
    default: return 0;
  }
}

export function runSimulation(inputs: SimulatorInputs): SimulationResults {
  const yearlyData: YearlyResults[] = [];
  let depletionYear: number | null = null;

  for (let i = 0; i < baselineYears.length; i++) {
    const year = baselineYears[i];
    const payroll = payroll2024 * Math.pow(1 + Math.min(payrollGrowth, 0.06), year - 2024);
    
// Income: tax‑rate adjustments
const rateIncCombined = inputs.combinedTaxStep   / 0.1;   // how many 0.1‑ppt bumps
const rateIncEmpOnly  = inputs.empTaxOnlyStep    / 0.1;
const rateIncEmpSur   = inputs.employerSurcharge / 0.1;

const incRateBump =
  (rateIncCombined * coeffCombinedRate +
   rateIncEmpOnly  * coeffSingleSideRate +
   rateIncEmpSur   * coeffSingleSideRate) * payroll;

    
    const wageGainPct = getWageGainPct(inputs.empCapOption, inputs.customCapPct);
    const incCapLift = (wageGainPct / 5) * coeffWageShareEmp * payroll;
    
    const incImmigRamp = inputs.immigBoostM * coeffImmig1M * payroll * ramp(year);
    
    const incEquity = (inputs.equityShiftB / 100) * 0.9; // $0.9B per $100B
    
    const incGenRev = inputs.genRevTransferB;
    
    const newIncome = baselineIncome[i] + incRateBump + incCapLift + incImmigRamp + incEquity + incGenRev;
    
    // Cost adjustments
    const costFRA = -inputs.fraYearsUp * coeffFRA_1yr * payroll;
    const costChCPI = -(inputs.chainedCPIflag ? 1 : 0) * coeffChainedCPI * payroll;
    const costPPI = -(inputs.ppiCoveragePct / 10) * coeffPPI_10ppt * payroll;
    
    const newCost = baselineCost[i] + costFRA + costChCPI + costPPI;
    
    // Trust-fund dynamics
    let newAssets: number;
    if (i === 0) {
      newAssets = baselineAssets[i] + newIncome - newCost;
    } else {
      newAssets = yearlyData[i-1].assets + newIncome - newCost;
    }
    
    if (newAssets < 0) {
      newAssets = 0;
      
      // If assets hit zero and we haven't recorded a depletion year yet
      if (depletionYear === null) {
        depletionYear = year;
      }
    }
    
    const tfRatio = newAssets / newCost;
    const monthsReserve = tfRatio * 12;
    
    yearlyData.push({
      year,
      income: newIncome,
      cost: newCost,
      surplus: newIncome - newCost,
      assets: newAssets,
      monthsReserve
    });
  }
  
  // If the trust fund never depletes in our simulation time period
  if (depletionYear === null && yearlyData.some(data => data.assets === 0)) {
    // Find the first year where assets hit zero
    const firstZeroAssetYear = yearlyData.find(data => data.assets === 0);
    if (firstZeroAssetYear) {
      depletionYear = firstZeroAssetYear.year;
    }
  }
  
  // Add extrapolation logic for depletion years beyond our simulation period
  if (depletionYear === null && yearlyData.length > 0) {
    const lastYearData = yearlyData[yearlyData.length - 1];
    
    // Only try to extrapolate if we have positive assets but negative surplus
    // (meaning the fund is heading toward depletion)
    if (lastYearData.assets > 0 && lastYearData.surplus < 0) {
      // Estimate years until depletion using last year's assets and surplus
      const yearsUntilDepletion = Math.ceil(lastYearData.assets / Math.abs(lastYearData.surplus));
      depletionYear = lastYearData.year + yearsUntilDepletion;
    }
  }
  
  return {
    yearlyData,
    depletionYear
  };
}
