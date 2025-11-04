import { useMemo } from "react";

import { HomeSummary } from "./Summary";
import { useHomeSummary } from "@/api/home";
import { ExpiringSoon } from "./ExpiringSoon";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { QuickInsight } from "./QuickInsight";
import { RecentActivities } from "./RecentActivities";
import SubscriptionForm from "@/components/SubscriptionForm";

const Home = () => {
  const { data, } = useHomeSummary();

  const summary = useMemo(() => {
    return {
      monthlySpending: data?.data.monthlySpending || 0,
      yearlySpending: data?.data.yearlySpending || 0,
      renewalsCount: data?.data.renewalsCount || 0,
      renewals: data?.data.renewals || [],
    }
  }, [data])

  return (
    <div className="space-y-8">
      <HomeSummary {...summary} />
      <ExpiringSoon renewals={summary.renewals} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CategoryBreakdown />
        <QuickInsight />
      </div>
      <RecentActivities />
      {/* {showAddForm && } */}
      <SubscriptionForm />
    </div>
  );
};
export default Home;
