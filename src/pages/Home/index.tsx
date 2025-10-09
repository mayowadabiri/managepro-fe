import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import Typography from "../../components/Typography";
import {
  CreditCardIcon,
  DollarSignIcon,
  CalendarIcon,
  BellIcon,
  TrendingUpIcon,
  ArrowUpRightIcon,
  BarChart3Icon,
  PieChartIcon,
  PlusIcon,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  subscriptions as initialSubscriptions,
  Subscription,
} from "../../utils/mockData";
import SubscriptionForm from "../../components/SubscriptionForm";
import Calendar from "../../components/Calendar";
import { HomeSummary } from "./Summary";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [subs, setSubs] = useState<Subscription[]>(initialSubscriptions);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // Calculate stats
  const totalMonthly = subs.reduce((total, sub) => {
    if (sub.billingCycle === "weekly") return total + (sub.price * 52) / 12;
    if (sub.billingCycle === "monthly") return total + sub.price;
    if (sub.billingCycle === "yearly") return total + sub.price / 12;
    if (sub.billingCycle === "quarterly") return total + sub.price / 3;
    return total;
  }, 0);
  const totalYearly = totalMonthly * 12;
  // Find upcoming renewals (next 14 days)
  const today = new Date();
  const twoWeeksLater = new Date();
  twoWeeksLater.setDate(today.getDate() + 14);
  const upcomingRenewals = subs
    .filter((sub) => {
      const renewalDate = new Date(sub.nextBillingDate);
      return renewalDate >= today && renewalDate <= twoWeeksLater;
    })
    .sort((a, b) => {
      return (
        new Date(a.nextBillingDate).getTime() -
        new Date(b.nextBillingDate).getTime()
      );
    });
  // Get all renewal dates for the calendar
  const renewalDates = subs.map((sub) => new Date(sub.nextBillingDate));
  // Calculate spending by category for pie chart
  const spendingByCategory = subs.reduce((acc, sub) => {
    const { category, price, billingCycle } = sub;
    let normalizedPrice = price;
    if (billingCycle === "yearly") normalizedPrice = price / 12;
    if (billingCycle === "quarterly") normalizedPrice = price / 3;
    if (billingCycle === "weekly") normalizedPrice = (price * 52) / 12;
    if (!acc[category]) {
      acc[category] = {
        name: category,
        value: 0,
      };
    }
    acc[category].value += normalizedPrice;
    return acc;
  }, {});
  const categoryData = Object.values(spendingByCategory);
  const COLORS = [
    "#4F46E5",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
  ];
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };
  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  // Handle subscription click
  const handleSubscriptionClick = (id: string) => {
    navigate({ to: `/subscription/${id}` });
  };
  // Handle add subscription
  const handleAddSubscription = (
    subscription: Omit<Subscription, "id"> & { id?: string }
  ) => {
    // Generate a new ID
    const newId = (Math.max(...subs.map((s) => parseInt(s.id))) + 1).toString();
    // Add the new subscription
    setSubs((prev) => [
      ...prev,
      {
        ...subscription,
        id: newId,
      } as Subscription,
    ]);
    // Close the form
    setShowAddForm(false);
  };
  // Handle date selection in calendar
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Find subscriptions due on this date
    const subscriptionsDueOnDate = subs.filter((sub) => {
      const renewalDate = new Date(sub.nextBillingDate);
      return (
        renewalDate.getDate() === date.getDate() &&
        renewalDate.getMonth() === date.getMonth() &&
        renewalDate.getFullYear() === date.getFullYear()
      );
    });
    // If there are subscriptions due on this date, you could show them or navigate to them
    if (subscriptionsDueOnDate.length > 0) {
      // For example, you could navigate to the first subscription
      // navigate({ to: `/subscription/${subscriptionsDueOnDate[0].id}` });
      // Or show a notification
      console.log(
        `${subscriptionsDueOnDate.length} subscriptions due on ${date.toDateString()}`
      );
    }
  };
  return (
    <div className="space-y-8">
      {/* Header with summary stats */}
      <HomeSummary />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
          <div className="p-6 pb-3 flex justify-between items-center">
            <div>
              <Typography
                component="h2"
                size="lg"
                weight="bold"
                className="text-gray-900"
              >
                Expiring Soon
              </Typography>
              <Typography size="sm" className="text-gray-500">
                Subscriptions renewing in the next 14 days
              </Typography>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="flex items-center px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 text-sm font-medium transition-colors"
              >
                <PlusIcon size={16} className="mr-2" />
                Add Subscription
              </button>
              <Link
                to="/subscriptions"
                className="text-teal-600 hover:text-teal-800 text-sm font-medium flex items-center"
              >
                View all <ArrowUpRightIcon size={14} className="ml-1" />
              </Link>
            </div>
          </div>
          <div className="px-6 pb-6">
            {upcomingRenewals.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {upcomingRenewals.map((subscription) => {
                  const daysLeft = getDaysUntil(subscription.nextBillingDate);
                  return (
                    <div
                      key={subscription.id}
                      className="py-4 flex items-center justify-between hover:bg-gray-50 rounded-lg px-3 -mx-3 cursor-pointer transition-colors"
                      onClick={() => handleSubscriptionClick(subscription.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                          <img
                            src={subscription.logo}
                            alt={subscription.name}
                            className="w-10 h-10 object-contain"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${subscription.name}&background=random&color=fff&size=128`;
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {subscription.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {subscription.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="font-semibold text-gray-900">
                          ${subscription.price.toFixed(2)}
                          <span className="text-sm text-gray-500 font-normal ml-1">
                            /{subscription.billingCycle.slice(0, 2)}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <div
                            className={`h-2 w-2 rounded-full mr-2 ${daysLeft <= 3 ? "bg-red-500" : daysLeft <= 7 ? "bg-amber-500" : "bg-emerald-500"}`}
                          ></div>
                          <span className="text-sm text-gray-500">
                            {daysLeft === 0
                              ? "Today"
                              : daysLeft === 1
                                ? "Tomorrow"
                                : `${daysLeft} days`}
                            {" - "}
                            {formatDate(subscription.nextBillingDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                  <CalendarIcon size={24} />
                </div>
                <Typography className="text-gray-600" weight="medium">
                  No upcoming renewals
                </Typography>
                <Typography size="sm" className="text-gray-500 mt-1">
                  You're all set for the next 14 days
                </Typography>
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 flex items-center px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 text-sm font-medium transition-colors mx-auto"
                >
                  <PlusIcon size={16} className="mr-2" />
                  Add Subscription
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Calendar Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 pb-3">
            <Typography
              component="h2"
              size="lg"
              weight="bold"
              className="text-gray-900"
            >
              Payment Calendar
            </Typography>
            <Typography size="sm" className="text-gray-500">
              Your upcoming subscription renewals
            </Typography>
          </div>
          <div className="px-6 pb-6">
            <Calendar
              value={selectedDate}
              onChange={handleDateSelect}
              highlightedDates={renewalDates}
            />
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-indigo-100 rounded-full mr-2"></div>
                <Typography className="text-gray-600">Renewal date</Typography>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 border border-blue-500 rounded-full mr-2"></div>
                <Typography className="text-gray-600">Today</Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Subscription Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
          <div className="p-6 pb-3">
            <Typography
              component="h2"
              size="lg"
              weight="bold"
              className="text-gray-900"
            >
              Category Breakdown
            </Typography>
            <Typography size="sm" className="text-gray-500">
              Your monthly spending by category
            </Typography>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 px-6 pb-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center space-y-3">
              {categoryData.map((cat, index) => {
                const category = cat as { name: string; value: number };
                return (
                  <div
                    key={category.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-sm mr-2"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                      <Typography size="sm" weight="medium">
                        {category.name}
                      </Typography>
                    </div>
                    <Typography size="sm" weight="semibold">
                      ${category.value.toFixed(2)}
                    </Typography>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* Quick Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 pb-3">
            <Typography
              component="h2"
              size="lg"
              weight="bold"
              className="text-gray-900"
            >
              Quick Insights
            </Typography>
            <Typography size="sm" className="text-gray-500">
              At a glance
            </Typography>
          </div>
          <div className="px-6 pb-6 space-y-4">
            <Link
              to="/insights"
              className="block p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg hover:from-indigo-100 hover:to-blue-100 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-indigo-600">
                  <TrendingUpIcon size={18} className="mr-2" />
                  <Typography component="h3" weight="medium">
                    Spending Trends
                  </Typography>
                </div>
                <ArrowUpRightIcon size={14} className="text-indigo-600" />
              </div>
              <Typography size="sm" className="text-gray-600">
                Your spending is 8% lower than last month
              </Typography>
            </Link>
            <Link
              to="/insights"
              className="block p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg hover:from-emerald-100 hover:to-teal-100 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-emerald-600">
                  <BarChart3Icon size={18} className="mr-2" />
                  <Typography component="h3" weight="medium">
                    Usage Analysis
                  </Typography>
                </div>
                <ArrowUpRightIcon size={14} className="text-emerald-600" />
              </div>
              <Typography size="sm" className="text-gray-600">
                You could save $24.97 by optimizing plans
              </Typography>
            </Link>
            <Link
              to="/insights"
              className="block p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg hover:from-amber-100 hover:to-orange-100 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-amber-600">
                  <PieChartIcon size={18} className="mr-2" />
                  <Typography component="h3" weight="medium">
                    Subscription Mix
                  </Typography>
                </div>
                <ArrowUpRightIcon size={14} className="text-amber-600" />
              </div>
              <Typography size="sm" className="text-gray-600">
                Entertainment makes up 42% of your spending
              </Typography>
            </Link>
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 pb-3 flex justify-between items-center">
          <div>
            <Typography
              component="h2"
              size="lg"
              weight="bold"
              className="text-gray-900"
            >
              Recent Subscriptions
            </Typography>
            <Typography size="sm" className="text-gray-500">
              Your active subscriptions
            </Typography>
          </div>
          <Link
            to="/subscriptions"
            className="text-teal-600 hover:text-teal-800 text-sm font-medium flex items-center"
          >
            View all <ArrowUpRightIcon size={14} className="ml-1" />
          </Link>
        </div>
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {subs.slice(0, 6).map((subscription) => (
              <div
                key={subscription.id}
                className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 hover:shadow-sm cursor-pointer transition-all"
                onClick={() => handleSubscriptionClick(subscription.id)}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={subscription.logo}
                      alt={subscription.name}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${subscription.name}&background=random&color=fff&size=128`;
                      }}
                    />
                  </div>
                  <div>
                    <Typography
                      component="h3"
                      weight="medium"
                      className="text-gray-900"
                    >
                      {subscription.name}
                    </Typography>
                    <Typography size="xs" className="text-gray-500">
                      {subscription.category}
                    </Typography>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <Typography size="xs" className="text-gray-500">
                    Next billing: {formatDate(subscription.nextBillingDate)}
                  </Typography>
                  <Typography weight="semibold" className="text-gray-900">
                    ${subscription.price.toFixed(2)}
                    <span className="text-xs text-gray-500 font-normal ml-1">
                      /{subscription.billingCycle.slice(0, 2)}
                    </span>
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Add Subscription Form */}
      {/* {showAddForm && <SubscriptionForm onSubmit={handleAddSubscription} onCancel={() => setShowAddForm(false)} />} */}
    </div>
  );
};
export default Home;
