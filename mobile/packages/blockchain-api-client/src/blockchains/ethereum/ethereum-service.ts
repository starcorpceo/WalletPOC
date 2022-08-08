import { Service } from '../../base/service';
import { Network } from '../../base/types';
import { EthereumFactory, EthereumProvider } from './ethereum-factory';
import { EthereumBalance, EthereumTransaction } from './types';

export class EthereumService implements Service {
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

    console.log('whaa', apiTransactions);

    return mapper.responseToTransactions(apiTransactions);
  };
}
