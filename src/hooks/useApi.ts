import { useState, useCallback } from "react";
import { type AxiosRequestConfig, type AxiosResponse } from "axios";
import axiosInstance from "@/lib/axios";

interface UseApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (config: AxiosRequestConfig) => Promise<T | null>;
  get: (url: string, config?: AxiosRequestConfig) => Promise<T | null>;
  post: (
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) => Promise<T | null>;
  put: (
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) => Promise<T | null>;
  patch: (
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) => Promise<T | null>;
  del: (url: string, config?: AxiosRequestConfig) => Promise<T | null>;
}

export const useApi = <T = any>(): UseApiResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (config: AxiosRequestConfig): Promise<T | null> => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const response: AxiosResponse<T> = await axiosInstance(config);
        setData(response.data);
        return response.data;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.error?.message ||
          err.message ||
          "An unexpected error occurred";
        setError(errorMsg);

        if (err.response?.data) {
          return err.response.data as T;
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const get = useCallback(
    (url: string, config?: AxiosRequestConfig) =>
      execute({ ...config, method: "GET", url }),
    [execute]
  );

  const post = useCallback(
    (url: string, data?: any, config?: AxiosRequestConfig) =>
      execute({ ...config, method: "POST", url, data }),
    [execute]
  );

  const put = useCallback(
    (url: string, data?: any, config?: AxiosRequestConfig) =>
      execute({ ...config, method: "PUT", url, data }),
    [execute]
  );

  const patch = useCallback(
    (url: string, data?: any, config?: AxiosRequestConfig) =>
      execute({ ...config, method: "PATCH", url, data }),
    [execute]
  );

  const del = useCallback(
    (url: string, config?: AxiosRequestConfig) =>
      execute({ ...config, method: "DELETE", url }),
    [execute]
  );

  return {
    data,
    loading,
    error,
    execute,
    get,
    post,
    put,
    patch,
    del,
  };
};
