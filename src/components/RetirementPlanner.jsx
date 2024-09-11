import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import RetirementChart from './RetirementChart';

const RetirementPlanner = () => {
    const [inputs, setInputs] = useState({
        age: 30,
        retirementAge: 65,
        lifespan: 85,
        initialInvestment: 50000,
        yearlySaving: 10000,
        yearlySavingGrowth: 0.03, // 3% growth in yearly savings
        yearlyExpense: 50000,
        inflation: 0.02,
        returnBeforeRetirement: 0.07,
        returnAfterRetirement: 0.04
        });

  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: parseFloat(e.target.value) });
  };

  const calculateRetirement = () => {
    const {
      age, retirementAge, lifespan, initialInvestment, yearlySaving,
      yearlySavingGrowth, yearlyExpense, inflation, returnBeforeRetirement, returnAfterRetirement
    } = inputs;
  
    let netWorth = initialInvestment;
    const data = [];
    let isViable = true;
    let currentYearlySaving = yearlySaving;
  
    for (let year = age; year <= lifespan; year++) {
      const isRetired = year >= retirementAge;
      const returnRate = isRetired ? returnAfterRetirement : returnBeforeRetirement;
      const inflationMultiplier = Math.pow(1 + inflation, year - age);
      const inflatedExpense = yearlyExpense * inflationMultiplier;
  
      if (!isRetired) {
        netWorth = netWorth * (1 + returnRate) + currentYearlySaving;
        currentYearlySaving *= (1 + yearlySavingGrowth); // Increase yearly saving
        data.push({ 
          year, 
          netWorth: Math.round(netWorth), 
          expense: 0, 
          saving: Math.round(currentYearlySaving) 
        });
      } else {
        netWorth = netWorth * (1 + returnRate) - inflatedExpense;
        data.push({ 
          year, 
          netWorth: Math.round(netWorth), 
          expense: Math.round(inflatedExpense),
          saving: 0
        });
      }
  
      if (netWorth < 0) {
        isViable = false;
        break;
      }
    }
  
    setResults({ data, isViable });
  };
  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value;
  };
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Retirement Planner</CardTitle>
            <CardDescription>Plan your retirement by adjusting the parameters below</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(inputs).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="text-sm">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Label>
                  <Input
                    type="number"
                    id={key}
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                    className="h-8 text-sm"
                  />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={calculateRetirement}>Calculate</Button>
          </CardFooter>
        </Card>

        {results && (
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Retirement Plan Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-lg font-bold ${results.isViable ? 'text-green-600' : 'text-red-600'}`}>
                {results.isViable ? 'Your retirement plan is viable!' : 'Your retirement plan is not viable.'}
              </p>
              <div className="mt-4 h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={formatYAxis} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="netWorth" stroke="#8884d8" name="Net Worth" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="expense" stroke="#82ca9d" name="Yearly Expense" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="px-2 py-1">Year</th>
                      <th className="px-2 py-1">Net Worth</th>
                      <th className="px-2 py-1">Yearly Expense</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.data.map((item) => (
                      <tr key={item.year}>
                        <td className="border px-2 py-1">{item.year}</td>
                        <td className="border px-2 py-1">${item.netWorth.toLocaleString()}</td>
                        <td className="border px-2 py-1">${item.expense.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RetirementPlanner;