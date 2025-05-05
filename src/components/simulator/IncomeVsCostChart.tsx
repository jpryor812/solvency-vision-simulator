
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { YearlyResults } from '@/lib/solvency-calculator';

interface IncomeVsCostChartProps {
  data: YearlyResults[];
}

const IncomeVsCostChart: React.FC<IncomeVsCostChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    year: item.year,
    income: Number(item.income.toFixed(1)),
    cost: Number(item.cost.toFixed(1))
  }));

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle>Income vs. Cost (2024-2033)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <XAxis dataKey="year" />
              <YAxis 
                domain={['auto', 'auto']} 
                tickFormatter={(value) => `$${value}B`} 
              />
              <Tooltip 
                formatter={(value: number) => [`$${value}B`, undefined]} 
                labelFormatter={(label) => `Year: ${label}`} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                name="Income" 
                stroke="#4f46e5" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
              />
              <Line 
                type="monotone" 
                dataKey="cost" 
                name="Cost" 
                stroke="#f87171" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeVsCostChart;
