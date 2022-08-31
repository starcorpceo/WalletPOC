import { proxyAddress } from "../config/config";
import { PendingTransaction } from "../state/polygon-atoms";

import abiCoder from "web3-eth-abi";

export function checkDepositStatus(userAccount: string, pendingTransactions: PendingTransaction[]) {
  // For Mumbai
  const ws = new WebSocket("wss://ws-mumbai.matic.today/");
  // For Polygon mainnet: wss://ws-mainnet.matic.network/
  console.log(pendingTransactions);
  const childChainManagerProxy = proxyAddress;

  return Observable<PendingTransaction>((observer) => {
    ws.onopen = () => {
      ws.send(
        `{"id": 1, "method": "eth_subscribe", "params": ["newDeposits", {"Contract": "${childChainManagerProxy}"}]}`
      );
    };

    ws.onmessage = (msg) => {
      const parsedMsg = JSON.parse(msg.data);
      console.log(parsedMsg);
      if (parsedMsg && parsedMsg.params && parsedMsg.params.result && parsedMsg.params.result.Data) {
        const fullData = parsedMsg.params.result.Data;
        const { 0: syncType, 1: syncData } = abiCoder.decodeParameters(["bytes32", "bytes"], fullData);

        // check if sync is of deposit type (keccak256("DEPOSIT"))
        const depositType = "0x87a7811f4bfedea3d341ad165680ae306b01aaeacc205d227629cf157dd9f821";
        if (syncType.toLowerCase() === depositType.toLowerCase()) {
          const {
            0: userAddress,
            1: rootTokenAddress,
            2: depositData,
          } = abiCoder.decodeParameters(["address", "address", "bytes"], syncData);

          // depositData can be further decoded to get amount, tokenId etc. based on token type
          // For ERC20 tokens
          const { 0: amount } = abiCoder.decodeParameters(["uint256"], depositData);

          console.log("Found something, checking: ", amount, rootTokenAddress, userAddress);
          if (userAddress.toLowerCase() === userAccount.toLowerCase()) {
            const matching = pendingTransactions.find(
              (transaction) =>
                transaction.token.ethereumAddress.toLowerCase() === rootTokenAddress.toLowerCase() &&
                amount === transaction.amount
            );
            matching && observer.next({ ...matching, checkpointed: true });
          }
        }
      }
    };

    ws.onerror = (err) => {
      observer.error(err);
    };

    ws.onclose = (event) => {
      console.log("Closed");
      observer.error(new Error("Conn closed: " + event.code + " " + event.reason));
    };
  });
}

const Observable = <T>(subscriber: Subscriber<T>) => {
  return {
    subscribe: (observer: Observer<T>) => subscriber(observer),
  };
};

type Observer<O> = {
  next: Next<O>;
  error: Error;
};

type Next<N> = (value: N) => void;
type Error = (error: unknown) => void;

type Subscriber<T> = (observer: Observer<T>) => void;
