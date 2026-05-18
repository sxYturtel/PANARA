import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from "./ui/card";

interface PriceChartProps {
  title: string;
  data: Array<{
    date: string;
    [key: string]: string | number;
  }>;
  dataKeys: Array<{
    key: string;
    color: string;
    name: string;
  }>;
}

export function PriceChart({ title, data, dataKeys }: PriceChartProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px'
            }}
            formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`}
          />
          <Legend 
            wrapperStyle={{ fontSize: '14px' }}
          />
          {dataKeys.map(({ key, color, name }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2}
              name={name}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
