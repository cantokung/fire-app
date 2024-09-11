import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const formatCurrency = (value) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}k`;
  }
  return `$${value}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded shadow">
        <p className="font-bold">{`Year: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${formatCurrency(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const RetirementChart = ({ data, isViable }) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Retirement Plan Results</h2>
      <p className={`text-lg font-bold mb-4 ${isViable ? 'text-green-600' : 'text-red-600'}`}>
        {isViable ? 'Your retirement plan is viable!' : 'Your retirement plan is not viable.'}
      </p>
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis 
              tickFormatter={formatCurrency}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="netWorth" 
              stroke="#8884d8" 
              name="Net Worth" 
              strokeWidth={3} 
              dot={false} 
            />
            <Line 
              type="monotone" 
              dataKey="expense" 
              stroke="#82ca9d" 
              name="Yearly Expense" 
              strokeWidth={3} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RetirementChart;