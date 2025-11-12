import { FormValues, Services, Subscription } from "@/types";
import { get, post } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";

interface Args {
  service_name?: string;
  category?: number;
}

const getServices = async () => {
  const response = await get<Services[]>("/service");
  return response;
};

export const useGetServices = () => {
  return useQuery({
    queryFn: getServices,
    queryKey: ["services"],
  });
};

const createSubscription = async (payload: FormValues) => {
  const response = await post("/subscription", payload);
  return response;
};

export const useCreateSubscription = () => {
  return useMutation({
    mutationFn: createSubscription,
  });
};

const getUserSubscriptions = async (query: Args) => {
  const queryParams = new URLSearchParams();
  if (query.service_name) {
    queryParams.append("service_name", query.service_name);
  }
  if (query.category) {
    queryParams.append("category", query.category.toString());
  }

  const response = await get<Subscription[]>(
    `/subscription?${queryParams.toString()}`
  );
  return response;
};
export const useGetUserSubscriptions = (query: Args) => {
  return useQuery({
    queryFn: () => getUserSubscriptions(query),
    queryKey: ["user-subscriptions", query],
  });
};

const getSubscriptionById = async (id: number) => {
  const response = await get<Subscription>(`/subscription/${id}`);
  return response;
};

export const useGetSubscriptionById = (id: number) => {
  return useQuery({
    queryFn: () => getSubscriptionById(id),
    queryKey: ["subscription", id],
  });
};
