import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid, AreaChart, Area } from 'recharts';
import { subscriptions } from '../utils/mockData';
import { TrendingUpIcon, TrendingDownIcon, DollarSignIcon, AlertCircleIcon, BarChart3Icon, PieChartIcon, CalendarIcon, ArrowRightIcon } from 'lucide-react';
const Insights = () => {
  const [timeframe, setTimeframe] = useState('monthly');
  // Calculate spending by category
  const spendingByCategory = subscriptions.reduce((acc, sub) => {
    const {
      category,
      price,
      billingCycle
    } = sub;
    // Normalize to monthly price
    let normalizedPrice = price;
    if (billingCycle === 'yearly') normalizedPrice = price / 12;
    if (billingCycle === 'quarterly') normalizedPrice = price / 3;
    if (billingCycle === 'weekly') normalizedPrice = price * 52 / 12;
    if (!acc[category]) {
      acc[category] = {
        name: category,
        value: 0
      };
    }
    acc[category].value += normalizedPrice;
    return acc;
  }, {} as Record<string, {
    name: string;
    value: number;
  }>);
  const categoryData = Object.values(spendingByCategory).sort((a, b) => b.value - a.value);
  // Calculate spending over time (12 months)
  const currentMonth = new Date().getMonth();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const spendingOverTime = Array.from({
    length: 12
  }, (_, i) => {
    const monthIndex = (currentMonth - 11 + i) % 12;
    return {
      name: monthNames[monthIndex],
      amount: 0,
      previous: 0
    };
  });
  // Fill in spending data (just use the current spending for all months as mock data)
  const monthlyTotal = subscriptions.reduce((total, sub) => {
    if (sub.billingCycle === 'weekly') return total + sub.price * 52 / 12;
    if (sub.billingCycle === 'monthly') return total + sub.price;
    if (sub.billingCycle === 'yearly') return total + sub.price / 12;
    if (sub.billingCycle === 'quarterly') return total + sub.price / 3;
    return total;
  }, 0);
  spendingOverTime.forEach((month, i) => {
    // Add some variation to make the chart more interesting
    const variation = 0.8 + Math.sin(i * 0.5) * 0.2;
    const prevVariation = 0.9 + Math.cos(i * 0.5) * 0.3;
    month.amount = parseFloat((monthlyTotal * variation).toFixed(2));
    month.previous = parseFloat((monthlyTotal * prevVariation).toFixed(2));
  });
  // Calculate subscription count by billing cycle
  const subscriptionsByBillingCycle = subscriptions.reduce((acc, sub) => {
    const {
      billingCycle
    } = sub;
    if (!acc[billingCycle]) {
      acc[billingCycle] = {
        name: billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1),
        count: 0
      };
    }
    acc[billingCycle].count += 1;
    return acc;
  }, {} as Record<string, {
    name: string;
    count: number;
  }>);
  const billingCycleData = Object.values(subscriptionsByBillingCycle);
  // Create forecast data
  const forecastData = [...Array(6)].map((_, i) => {
    const baseAmount = monthlyTotal;
    let amount = baseAmount;
    // Add some realistic growth
    if (i > 0) {
      amount = baseAmount * (1 + 0.02 * i); // 2% growth per month
    }
    // Add some variation
    amount = amount * (0.95 + Math.random() * 0.1);
    const date = new Date();
    date.setMonth(date.getMonth() + i);
    return {
      name: monthNames[date.getMonth()],
      amount: parseFloat(amount.toFixed(2))
    };
  });
  // Calculate potential savings
  const potentialSavings = [{
    name: 'Annual vs Monthly',
    description: 'Switch monthly subscriptions to annual plans',
    savings: 36.5
  }, {
    name: 'Unused Services',
    description: 'Cancel rarely used subscriptions',
    savings: 24.99
  }, {
    name: 'Duplicate Services',
    description: 'Remove overlapping service categories',
    savings: 15.98
  }, {
    name: 'Family Plans',
    description: 'Use family plans instead of individual',
    savings: 18.45
  }];
  // Create usage data
  const usageData = subscriptions.map(sub => {
    // Randomly generate usage data for demo
    const usage = Math.floor(Math.random() * 100);
    return {
      id: sub.id,
      name: sub.name,
      usage: usage,
      status: usage < 30 ? 'low' : usage < 70 ? 'medium' : 'high'
    };
  }).sort((a, b) => a.usage - b.usage).slice(0, 5);
  // Colors for charts
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
          <p className="text-gray-500 mt-1">
            Analytics and trends for your subscriptions
          </p>
        </div>
        <div className="inline-flex rounded-lg shadow-sm">
          <button type="button" onClick={() => setTimeframe('monthly')} className={`px-4 py-2.5 text-sm font-medium rounded-l-lg ${timeframe === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-200`}>
            Monthly
          </button>
          <button type="button" onClick={() => setTimeframe('yearly')} className={`px-4 py-2.5 text-sm font-medium rounded-r-lg ${timeframe === 'yearly' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border-t border-r border-b border-gray-200`}>
            Yearly
          </button>
        </div>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Spending
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                $
                {timeframe === 'monthly' ? monthlyTotal.toFixed(2) : (monthlyTotal * 12).toFixed(2)}
              </h3>
              <p className="flex items-center text-sm text-green-600 mt-1">
                <TrendingDownIcon size={16} className="mr-1" />
                <span>8% lower than average</span>
              </p>
            </div>
            <div className="rounded-full bg-indigo-50 p-3 text-indigo-600">
              <DollarSignIcon size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Active Subscriptions
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {subscriptions.length}
              </h3>
              <p className="flex items-center text-sm text-amber-600 mt-1">
                <AlertCircleIcon size={16} className="mr-1" />
                <span>2 renewing soon</span>
              </p>
            </div>
            <div className="rounded-full bg-emerald-50 p-3 text-emerald-600">
              <CalendarIcon size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Potential Savings
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">$95.92</h3>
              <p className="flex items-center text-sm text-blue-600 mt-1">
                <TrendingUpIcon size={16} className="mr-1" />
                <span>4 optimization tips</span>
              </p>
            </div>
            <div className="rounded-full bg-blue-50 p-3 text-blue-600">
              <BarChart3Icon size={20} />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
          <div className="p-6 pb-3">
            <h2 className="text-lg font-bold text-gray-900">Spending Trends</h2>
            <p className="text-sm text-gray-500">
              Your spending over the last 12 months
            </p>
          </div>
          <div className="px-6 pb-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendingOverTime}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#94A3B8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={value => [`$${value}`, undefined]} labelFormatter={label => `${label} ${new Date().getFullYear()}`} />
                  <Legend />
                  <Area type="monotone" dataKey="previous" name="Previous Year" stroke="#94A3B8" fillOpacity={1} fill="url(#colorPrevious)" />
                  <Area type="monotone" dataKey="amount" name="Current Year" stroke="#4F46E5" fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* Spending by Category */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 pb-3">
            <h2 className="text-lg font-bold text-gray-900">
              Spending by Category
            </h2>
            <p className="text-sm text-gray-500">
              Your top spending categories
            </p>
          </div>
          <div className="px-6 pb-6">
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={value => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {categoryData.slice(0, 3).map((category, index) => <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-sm mr-2" style={{
                  backgroundColor: COLORS[index % COLORS.length]
                }}></div>
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <div className="text-sm font-semibold">
                    ${category.value.toFixed(2)}
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Forecast */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 pb-3">
            <h2 className="text-lg font-bold text-gray-900">
              Subscription Forecast
            </h2>
            <p className="text-sm text-gray-500">
              Projected spending for the next 6 months
            </p>
          </div>
          <div className="px-6 pb-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={value => `$${value}`} />
                  <Legend />
                  <Line type="monotone" dataKey="amount" name="Projected Spending" stroke="#8B5CF6" strokeWidth={2} dot={{
                  r: 4
                }} activeDot={{
                  r: 6
                }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* Billing Cycles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 pb-3">
            <h2 className="text-lg font-bold text-gray-900">Billing Cycles</h2>
            <p className="text-sm text-gray-500">
              Distribution of your subscription billing cycles
            </p>
          </div>
          <div className="px-6 pb-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={billingCycleData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={value => `${value} subscriptions`} />
                  <Bar dataKey="count" name="Number of Subscriptions" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Potential Savings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Optimization Tips
                </h2>
                <p className="text-sm text-gray-500">
                  Ways to reduce your spending
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-2 text-green-600">
                <DollarSignIcon size={18} />
              </div>
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="space-y-4">
              {potentialSavings.map((item, index) => <div key={index} className="flex items-start">
                  <div className="bg-green-100 text-green-800 rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {item.description}
                    </p>
                    <p className="text-sm font-medium text-green-600 mt-1">
                      Save ${item.savings.toFixed(2)}/month
                    </p>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
        {/* Usage Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Usage Analysis
                </h2>
                <p className="text-sm text-gray-500">
                  Subscriptions with low usage
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                <BarChart3Icon size={18} />
              </div>
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="space-y-4">
              {usageData.map(item => <div key={item.id} className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden mr-3">
                    <img src={subscriptions.find(s => s.id === item.id)?.logo} alt={item.name} className="w-8 h-8 object-contain" onError={e => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${item.name}&background=random&color=fff&size=128`;
                }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <span className="text-sm font-medium">{item.usage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${item.status === 'low' ? 'bg-red-500' : item.status === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`} style={{
                    width: `${item.usage}%`
                  }}></div>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
        {/* Recommendations */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl shadow-sm overflow-hidden text-white">
          <div className="p-6 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Recommendations</h2>
                <p className="text-indigo-200 text-sm">Personalized for you</p>
              </div>
              <div className="rounded-lg bg-white/20 backdrop-blur-sm p-2">
                <PieChartIcon size={18} />
              </div>
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-medium mb-1">
                  Bundle Entertainment Services
                </h3>
                <p className="text-sm text-indigo-100 mb-2">
                  You have 3 separate streaming services. Consider bundling them
                  for better value.
                </p>
                <button className="text-xs font-medium flex items-center text-white hover:text-indigo-100">
                  View options <ArrowRightIcon size={12} className="ml-1" />
                </button>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-medium mb-1">Switch to Annual Plans</h3>
                <p className="text-sm text-indigo-100 mb-2">
                  Save up to 20% by switching your monthly subscriptions to
                  annual billing.
                </p>
                <button className="text-xs font-medium flex items-center text-white hover:text-indigo-100">
                  See savings <ArrowRightIcon size={12} className="ml-1" />
                </button>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-medium mb-1">Cancel Duplicate Services</h3>
                <p className="text-sm text-indigo-100 mb-2">
                  You have overlapping cloud storage services. Consider
                  consolidating.
                </p>
                <button className="text-xs font-medium flex items-center text-white hover:text-indigo-100">
                  Compare options <ArrowRightIcon size={12} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Insights;