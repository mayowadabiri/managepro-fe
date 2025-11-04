import { get } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

interface HomeSummaryResponse {
  monthlySpending: number;
  yearlySpending: number;
  renewalsCount: number;
  renewals: any[];
}

const summary = async () => {
  const response = await get<HomeSummaryResponse>("/analytics/summary");
  return response;
};

export const useHomeSummary = () => {
  return useQuery({
    queryFn: summary,
    queryKey: ["home-summary"],
    retry: false,
  });
};
