import { STATUS } from "@/constants/constants";
import axios from "axios";
import { toast } from "sonner";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const CONFIG_KEY = process.env.NEXT_PUBLIC_CONFIG_KEY;
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: process.env.NEXT_PUBLIC_API_KEY,
  },
});

// Response interceptor to catch all errors
apiClient.interceptors.response.use(
  (response) => response,
  (err) => {
    toast.error(
      err?.message === "Network Error"
        ? STATUS.SERVER_ERROR
        : err?.response?.data?.message || err?.message
    );
    return Promise.reject(err);
  }
);

export default apiClient;
