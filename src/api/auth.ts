import { CreateUser, User } from "@/types";
import { get, post } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";

const signUp = async (data: CreateUser) => {
  const response = await post("/auth", data);
  return response;
};

export const useSignup = () => {
  return useMutation({
    mutationFn: signUp,
    mutationKey: ["signup"],
  });
};

const verifyEmail = async (data: { email: string; code: string }) => {
  const response = await post("/auth/verify-email", data);
  return response;
};
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: verifyEmail,
    mutationKey: ["verify-email"],
  });
};

const login = async (data: { email: string; password: string }) => {
  const response = await post<{ token: string }>("/auth/login", data);
  return response;
};
export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    mutationKey: ["login"],
  });
};

const getUserAccount = async () => {
  const response = await get<User>("/user/me");
  return response;
};

export const useGetAccount = () => {
  return useQuery({
    queryFn: getUserAccount,
    queryKey: ["get-account"],
    retry: false,
  });
};

const loginWithGoogle = async (data: { credential: string }) => {
  const response = await post<{ token: string }>("/auth/google-login", data);
  return response;
};

export const useLoginWithGoogle = () => {
  return useMutation({
    mutationFn: loginWithGoogle,
    mutationKey: ["google-login"],
  });
};

const linkAccountWithGoogle = async (data: {
  password: string;
  credential: string;
}) => {
  const response = await post<{ token: string }>("/auth/link-google", data);
  return response;
};

export const useLinkAccountWithGoogle = () => {
  return useMutation({
    mutationFn: linkAccountWithGoogle,
    mutationKey: ["link-google-account"],
  });
};
