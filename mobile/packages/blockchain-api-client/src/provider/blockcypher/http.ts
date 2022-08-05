import { fetchFrom, HttpMethod, HttpParams } from "../../base/http";

export const fetchFromBlockCypher = async <T>(url: string, params?: HttpParams): Promise<T> => {
  if (!!params && !!params.method && params.method !== HttpMethod.GET) {
    const appendix = url.includes("?") ? "&" : "?";

    url = `${url}${appendix}token=${apiKey}`;
  }

  return fetchFrom(url, params);
};

const apiKey = "2952f06836cf48cc95d998b901c4a4bd ";
