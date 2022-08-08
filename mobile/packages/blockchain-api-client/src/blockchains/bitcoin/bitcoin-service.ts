import { Service } from '../../base/service';
import { BroadcastTransaction, Fees, Network } from '../../base/types';
import { BitcoinFactory, BitcoinProvider } from './bitcoin-factory';
import { BitcoinBalance, BitcoinTransaction } from './types';

export class BitcoinService implements Service {
  private factory: BitcoinFactory;

  constructor(network: Network) {
    this.factory = new BitcoinFactory(network);
  }

  /**
   *
   * @param txData txData exported from signed bitcoin.PSBT
   * @param provider Which API should be called
   * @returns
   */
  sendBroadcastTransaction = async (txData: string, provider: BitcoinProvider): Promise<BroadcastTransaction> => {
    const { mapper, fetcher } = this.factory.getProviderFunctions(provider);

    const apiBroadcastTransaction = await fetcher.sendBroadcastTransaction(txData);

    return mapper.responseToBroadcastTransaction(apiBroadcastTransaction);
  };

  /**
   *
   * @param address Address of the KeyPair of which we want to know the balance from
   * @param provider Which API should be called
   * @returns
   */
  getBalance = async (address: string, provider: BitcoinProvider): Promise<BitcoinBalance> => {
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
  ): Promise<BitcoinTransaction[]> => {
    const { mapper, fetcher } = this.factory.getProviderFunctions(provider);

    const apiTransactions = await fetcher.fetchTransactions(address, query);

    return mapper.responseToTransactions(apiTransactions);
  };

  /**
   *
   * @param chain Chain to lookup fees ex.: BTC
   * @param type Type what the transaction will do ex.: TRANSFER
   * @param fromUTXO UTXOs in input (txHash and index)
   * @param to Addresses and value in output
   * TATUM: https://apidoc.tatum.io/tag/Blockchain-fees#operation/EstimateFeeBlockchain
   * @param provider Which API should be called
   * @returns
   */
  getFees = async (
    chain: string,
    type: string,
    fromUTXO: any[],
    to: any[],
    provider: BitcoinProvider
  ): Promise<Fees> => {
    const { mapper, fetcher } = this.factory.getProviderFunctions(provider);

    const apiFees = await fetcher.fetchFees(chain, type, fromUTXO, to);

    return mapper.responseToFees(apiFees);
  };
}
