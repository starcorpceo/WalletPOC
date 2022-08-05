import { BitcoinProvider } from "./blockchains/bitcoin/bitcoin-factory";
import { BlockCypherBalance, BlockCypherBalanceFull } from "./provider/blockcypher/bitcoin/blockcypher-bitcoin-types";
import { TatumBalance, TatumTransaction } from "./provider/tatum/bitcoin/tatum-bitcoin-types";

export type Provider = BitcoinProvider;

export type ApiBalance<T = BlockCypherBalance | TatumBalance> = T;
export type ApiTransaction<T = BlockCypherBalanceFull | TatumTransaction[]> = T;

export interface TransactionRequest {}

export type Network = "TEST" | "MAIN";
