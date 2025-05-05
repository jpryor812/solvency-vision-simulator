
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { YearlyResults } from '@/lib/solvency-calculator';
import { formatCurrency } from '@/lib/solvency-constants';

interface DataTableProps {
  data: YearlyResults[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
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
              {data.map((row) => (
                <tr key={row.year}>
                  <td>{row.year}</td>
                  <td>{formatCurrency(row.income).replace('$', '')}</td>
                  <td>{formatCurrency(row.cost).replace('$', '')}</td>
                  <td className={row.surplus >= 0 ? 'text-solvency-surplus font-medium' : 'text-solvency-deficit font-medium'}>
                    {formatCurrency(row.surplus).replace('$', '')}
                  </td>
                  <td>{formatCurrency(row.assets).replace('$', '')}</td>
                  <td className={row.monthsReserve <= 0 ? 'text-solvency-deficit' : row.monthsReserve < 12 ? 'text-yellow-500' : ''}>
                    {row.monthsReserve.toFixed(1)}
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
