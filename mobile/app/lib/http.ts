import { Platform } from "react-native";

export enum HttpMethod {
  POST = "POST",
  GET = "GET",
}

export const fetchFromApi = async <T>(
  path: string,
  body?: any,
  method?: HttpMethod,
  args?: RequestInit
): Promise<T> => {
  const response = await fetch(getApiUrl("http") + path, {
    method: determineMethod(body, method),
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
    ...args,
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

const getApiUrl = (protocol: "ws" | "http"): string => {
  const localIp = Platform.OS === "android" ? "10.0.2.2" : "127.0.0.1";

  return `${protocol}://${localIp}:8080`;
};
