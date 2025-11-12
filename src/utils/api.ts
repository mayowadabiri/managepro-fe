import config from "@/config";
import { ApiError, ApiResponse } from "@/types/apiResponse";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

// const baseURL = import.meta.env.VITE_API_BASE_URL;

const baseURL = config.baseUrl;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const headers: any = {};

// Check token in url and clear
const url = new URL(location.href);
url.searchParams.delete("tk_access");

window.history.replaceState(null, "", url);

const axiosInstance = axios.create({
  baseURL,
  headers,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth_token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    throw handleAxiosError(error);
  }
);

export function handleAxiosError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status;
    const backendMessage = error.response?.data.errors?.message as
      | string
      | undefined;
    const message =
      backendMessage || error.message || "An unknown error occurred";

    const errors = error.response?.data?.errors;

    return {
      statusCode,
      message,
      errors,
    };
  }

  const e = error as Error;
  return {
    message: e.message,
    stack: e.stack,
  };
}

const handleResponse = <T>(response: AxiosResponse): ApiResponse<T> => {
  return {
    data: response.data.data,
  };
};

export const get = async <T>(
  url: string,
  config?: object
): Promise<ApiResponse<T>> => {
  const res = await axiosInstance.get(url, config);
  return handleResponse<T>(res);
};

export const post = async <T>(url: string, data?: object, config?: object) => {
  const res = await axiosInstance.post(url, data, config);
  return handleResponse<T>(res);
};

export const put = async <T>(
  url: string,
  data?: object,
  config?: object
): Promise<ApiResponse<T>> => {
  const res = await axiosInstance.put(url, data, config);
  return handleResponse<T>(res);
};

export const patch = async <T>(
  url: string,
  data?: object,
  config?: object
): Promise<ApiResponse<T>> => {
  const res = await axiosInstance.patch(url, data, config);
  return handleResponse<T>(res);
};

export const remove = async <T>(
  url: string,
  config?: object
): Promise<ApiResponse<T>> => {
  const res = await axiosInstance.delete(url, config);
  return handleResponse<T>(res);
};
export default axiosInstance;
