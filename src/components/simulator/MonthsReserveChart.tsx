
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { YearlyResults } from '@/lib/solvency-calculator';

interface MonthsReserveChartProps {
  data: YearlyResults[];
}

const MonthsReserveChart: React.FC<MonthsReserveChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    year: item.year,
    months: Number(item.monthsReserve.toFixed(1))
  }));

  // Function to determine bar color based on months reserve value
  const getBarColor = (months: number) => {
    if (months <= 0) return "#f87171"; // Depleted (red)
    if (months < 12) return "#fbbf24"; // Less than 1 year (warning)
    return "#4f46e5"; // Healthy (blue)
  };

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle>Months-of-Reserve (2024-2033)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <XAxis dataKey="year" />
              <YAxis domain={[0, 'auto']} />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)} months`, 'Reserve']} 
                labelFormatter={(label) => `Year: ${label}`} 
              />
              <Bar 
                dataKey="months" 
                name="Months of Reserve" 
                fill="#4f46e5"
                radius={[4, 4, 0, 0]}
                fillOpacity={0.8}
                isAnimationActive={true}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthsReserveChart;
