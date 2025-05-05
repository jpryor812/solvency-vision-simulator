import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { YearlyResults } from '@/lib/solvency-calculator';
import { formatCurrency } from '@/lib/solvency-constants';

interface DataTableProps {
  data: YearlyResults[];
  depletionYear: number | null;
}

// Function to extrapolate data for years beyond the baseline
function extrapolateAdditionalYears(
  lastYearData: YearlyResults,
  depletionYear: number | null,
  maxYears: number = 10
): YearlyResults[] {
  if (!depletionYear || depletionYear <= lastYearData.year) {
    return [];
  }
  
  const extraYears = Math.min(depletionYear - lastYearData.year + 3, maxYears);
  const extrapolatedData: YearlyResults[] = [];
  
  // Use the last year's data to project forward
  const incomeGrowthRate = 0.04; // Assume ~4% growth
  const costGrowthRate = 0.045; // Costs typically grow around 4.5%
  
  let prevYear = lastYearData;
  
  for (let i = 1; i <= extraYears; i++) {
    const year = lastYearData.year + i;
    const income = prevYear.income * (1 + incomeGrowthRate);
    const cost = prevYear.cost * (1 + costGrowthRate);
    const surplus = income - cost;
    const assets = Math.max(0, prevYear.assets + surplus);
    const monthsReserve = cost > 0 ? (assets / cost) * 12 : 0;
    
    const yearData: YearlyResults = {
      year,
      income,
      cost,
      surplus,
      assets,
      monthsReserve
    };
    
    extrapolatedData.push(yearData);
    prevYear = yearData;
  }
  
  return extrapolatedData;
}

const DataTable: React.FC<DataTableProps> = ({ data, depletionYear }) => {
  console.log("DataTable props:", { dataLength: data.length, depletionYear });
  
  // Get additional projected years if needed
  const extraYears = data.length > 0 && depletionYear && depletionYear > data[data.length - 1].year
    ? extrapolateAdditionalYears(data[data.length - 1], depletionYear)
    : [];
  
  console.log("Extrapolated years:", extraYears.length);
  
  // Combine original data with extrapolated data
  const allYearlyData = [...data, ...extraYears];
  
  // Filter data to show only years up to and including the depletion year,
  // or all years if depletionYear is null.
  const displayData = depletionYear === null
    ? allYearlyData
    : allYearlyData.filter(item => item.year <= depletionYear);
  
  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle>Annual Projections Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto max-h-80">
          <table className="data-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Income ($B)</th>
                <th>Cost ($B)</th>
                <th>Surplus/Deficit ($B)</th>
                <th>Assets ($B)</th>
                <th>Months Reserve</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((row) => (
                <tr key={row.year} className={row.year > data.length + 2023 ? "bg-gray-50" : ""}>
                  <td>{row.year}</td>
                  <td>{formatCurrency(row.income).replace('$', '')}</td>
                  <td>{formatCurrency(row.cost).replace('$', '')}</td>
                  <td className={row.surplus >= 0 ? 'text-solvency-surplus font-medium' : 'text-solvency-deficit font-medium'}>
                    {formatCurrency(row.surplus).replace('$', '')}
                  </td>
                  <td>{formatCurrency(row.assets).replace('$', '')}</td>
                  <td className={row.monthsReserve <= 0 ? 'text-solvency-deficit' : row.monthsReserve < 12 ? 'text-yellow-500' : ''}>
                    {row.monthsReserve <= 0 ? "Depleted" : row.monthsReserve.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;
