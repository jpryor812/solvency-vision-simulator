
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { YearlyResults } from '@/lib/solvency-calculator';
import { formatCurrency } from '@/lib/solvency-constants';

interface SummaryCardsProps {
  yearlyData: YearlyResults[];
  depletionYear: number | null;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ yearlyData, depletionYear }) => {
  // Get 2030 data (index 6)
  const data2030 = yearlyData[6];
  // Get 2033 data (index 9)
  const data2033 = yearlyData[9];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="card-shadow">
        <CardContent className="p-4 text-center">
          <h3 className="text-lg font-medium mb-2">Surplus/Deficit 2030</h3>
          <div className={`text-3xl font-bold ${data2030.surplus >= 0 ? 'text-solvency-surplus' : 'text-solvency-deficit'}`}>
            {formatCurrency(data2030.surplus)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {data2030.surplus >= 0 ? 'Surplus' : 'Deficit'}
          </div>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardContent className="p-4 text-center">
          <h3 className="text-lg font-medium mb-2">Trust-Fund Balance 2033</h3>
          <div className={`text-3xl font-bold ${data2033.assets > 0 ? 'text-solvency-surplus' : 'text-solvency-deficit'}`}>
            {formatCurrency(data2033.assets)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {data2033.assets > 0 ? `${data2033.monthsReserve.toFixed(1)} months reserve` : 'Depleted'}
          </div>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardContent className="p-4 text-center">
          <h3 className="text-lg font-medium mb-2">Depletion Year</h3>
          <div className={`text-3xl font-bold ${depletionYear && depletionYear > 2033 ? 'text-solvency-surplus' : depletionYear ? 'text-solvency-deficit' : 'text-solvency-surplus'}`}>
            {depletionYear ? depletionYear : 'After 2033'}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {depletionYear && depletionYear <= 2033 
              ? `${depletionYear - 2024} years from now` 
              : 'Extended solvency'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
