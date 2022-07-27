import { Platform } from "react-native";
import { apiKeys } from "../wallet/endpoints";

export enum HttpMethod {
  POST = "POST",
  GET = "GET",
}

export const fetchFromApi = async <T>(
  path: string,
  params?: HttpParams
): Promise<T> => {
  return fetchFrom(getApiUrl("http") + path, params);
};

export const fetchFromTatum = async <T>(
  url: string,
  params?: HttpParams
): Promise<T> => {
  return fetchFrom(url, {
    ...params,
    args: {
      ...params?.args,
      headers: {
        ...params?.args?.headers,
        "x-api-key": apiKeys.tatum,
      },
    },
  });
};

const fetchFrom = async <T>(url: string, params?: HttpParams): Promise<T> => {
  const { body, method, args } = params || {};

  const response = await fetch(url, {
    method: determineMethod(body, method),
    body: JSON.stringify(body),
    headers: {
      ...args?.headers,
      "Content-Type": "application/json",
    },
  });

  const content: T = await response.json();

  if (!response.ok) {
    console.error("Error from API, possibly show snackbar", content);
  }

  return content;
};

const determineMethod = (body?: any, method?: HttpMethod): HttpMethod => {
  if (!!method) return method;

  if (body) return HttpMethod.POST;

  return HttpMethod.GET;
};

export const getApiUrl = (protocol: "ws" | "http"): string => {
  const localIp = Platform.OS === "android" ? "10.0.2.2" : "127.0.0.1";

  return `${protocol}://${localIp}:8080`;
};

export type HttpParams = {
  args?: RequestInit;
  method?: HttpMethod;
  body?: any;
};
