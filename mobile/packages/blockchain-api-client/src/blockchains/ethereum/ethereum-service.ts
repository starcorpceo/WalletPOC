import { ApiBroadcastTransaction, Network } from '../../base/types';
import { EthereumFactory, EthereumProvider } from './ethereum-factory';
import { EthereumBalance, EthereumTransaction } from './types';

export class EthereumService {
  private factory: EthereumFactory;

  constructor(network: Network) {
    this.factory = new EthereumFactory(network);
  }

  /**
   *
   * @param address Address of the KeyPair of which we want to know the balance from
   * @param provider Which API should be called
   * @returns
   */
  getBalance = async (address: string, provider: EthereumProvider): Promise<EthereumBalance> => {
    const { mapper, fetcher } = this.factory.getProviderFunctions(provider);

    const apiBalance = await fetcher.fetchBalance(address);

    return mapper.responseToBalance(apiBalance);
  };

  /**
   *
   * @param address Address of the KeyPair of which transactions should be fetched
   * @param query Query Parameters for 3rd Party API
   * TATUM: https://apidoc.tatum.io/tag/Ethereum#operation/BtcGetTxByAddress
   * BLOCKCYPHER: https://www.blockcypher.com/dev/Ethereum/#address-full-endpoint
   * @param provider Which API should be called
   * @returns
   */
  getTransactions = async (
    address: string,
    query: URLSearchParams,
    provider: EthereumProvider
  ): Promise<EthereumTransaction[]> => {
    const { mapper, fetcher } = this.factory.getProviderFunctions(provider);

    const apiTransactions = await fetcher.fetchTransactions(address, query);

    return mapper.responseToTransactions(apiTransactions);
  };

  getFees = async (provider: EthereumProvider): Promise<string> => {
    const { mapper, fetcher } = this.factory.getProviderFunctions(provider);

    const apiFees = fetcher.fetchFees && (await fetcher.fetchFees());

    return mapper.responseToFees(apiFees);
  };

  sendRawTransaction = async (transaction: string, provider: EthereumProvider): Promise<string> => {
    const { fetcher, mapper } = this.factory.getProviderFunctions(provider);

    const apiResult = fetcher.sendRawTransaction && (await fetcher.sendRawTransaction(transaction));

    return mapper.responseToBroadCastTransactionResult(apiResult as ApiBroadcastTransaction);
  };

  getTransactionCount = async (address: string, provider: EthereumProvider): Promise<string> => {
    const { fetcher, mapper } = this.factory.getProviderFunctions(provider);

    const apiResult = fetcher.fetchTransactionCount && (await fetcher.fetchTransactionCount(address));

    return mapper.responseToTransactionCount(apiResult as ApiBroadcastTransaction);
  };
}
