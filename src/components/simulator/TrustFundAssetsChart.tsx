
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { YearlyResults } from '@/lib/solvency-calculator';

interface TrustFundAssetsChartProps {
  data: YearlyResults[];
}

const TrustFundAssetsChart: React.FC<TrustFundAssetsChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    year: item.year,
    assets: Number(item.assets.toFixed(1))
  }));

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle>Trust-Fund Assets (2024-2033)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <XAxis dataKey="year" />
              <YAxis 
                domain={[0, 'auto']} 
                tickFormatter={(value) => `$${value}B`} 
              />
              <Tooltip 
                formatter={(value: number) => [`$${value}B`, 'Assets']} 
                labelFormatter={(label) => `Year: ${label}`} 
              />
              <Line 
                type="monotone" 
                dataKey="assets" 
                name="Trust Fund Assets" 
                stroke="#4f46e5" 
                strokeWidth={2} 
                fill="#4f46e5" 
                dot={{ r: 4 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrustFundAssetsChart;
