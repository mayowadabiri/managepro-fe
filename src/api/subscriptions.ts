import { FormValues, Services } from "@/types";
import { get, post } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";

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
