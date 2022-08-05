import { Balance, Transaction } from "wallet/types/wallet";
import { Service } from "../../base/service";
import { Network } from "../../base/types";
import { BitcoinFactory, BitcoinProvider } from "./bitcoin-factory";

export class BitcoinService implements Service {
  private factory: BitcoinFactory;

  constructor(network: Network) {
    this.factory = new BitcoinFactory(network);
  }

  /**
   *
   * @param address Address of the KeyPair of which we want to know the balance from
   * @param provider Which API should be called
   * @returns
   */
  getBalance = async (address: string, provider: BitcoinProvider): Promise<Balance> => {
    const { mapper, fetcher } = this.factory.getProviderFunctions(provider);

    const apiBalance = await fetcher.fetchBalance(address);

    return mapper.responseToBalance(apiBalance);
  };

  /**
   *
   * @param address Address of the KeyPair of which transactions should be fetched
   * @param query Query Parameters for 3rd Party API
   * TATUM: https://apidoc.tatum.io/tag/Bitcoin#operation/BtcGetTxByAddress
   * BLOCKCYPHER: https://www.blockcypher.com/dev/bitcoin/#address-full-endpoint
   * @param provider Which API should be called
   * @returns
   */
  getTransactions = async (
    address: string,
    query: URLSearchParams,
    provider: BitcoinProvider
  ): Promise<Transaction[]> => {
    const { mapper, fetcher } = this.factory.getProviderFunctions(provider);

    const apiTransactions = await fetcher.fetchTransactions(address, query);

    return mapper.responseToTransactions(apiTransactions);
  };
}
