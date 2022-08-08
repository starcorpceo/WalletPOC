import { Fetcher } from "./fetcher";
import { Mapper } from "./mapper";
import { Provider } from "./types";

export type ProviderFunctions = {
  mapper: Mapper;
  fetcher: Fetcher;
};

export interface Factory {
  getProviderFunctions: (provider: Provider) => ProviderFunctions;
}
