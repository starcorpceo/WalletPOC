import { swapFeeAddress, swapFeePercentage } from "ethereum/config/ethereum-constants";
import { ERC20Token } from "ethereum/config/token-constants";
import { EthereumService } from "packages/blockchain-api-client/src";
import { EthereumProviderEnum } from "packages/blockchain-api-client/src/blockchains/ethereum/ethereum-factory";
import { ZeroExSwapQuote } from "packages/blockchain-api-client/src/provider/0x/ethereum/0x-ethereum-types";
import { MPCSigner } from "../zksync/signer";

export const getSwapQuote = async (
  tokenFrom: ERC20Token,
  tokenTo: ERC20Token,
  myAddress: string,
  amount: string,
  service: EthereumService
): Promise<ZeroExSwapQuote> => {
  const params =
    "buyToken=" +
    tokenTo.contractAddress +
    "&sellToken=" +
    tokenFrom.contractAddress +
    "&sellAmount=" +
    amount +
    "&feeRecipient=" +
    swapFeeAddress +
    "&buyTokenPercentageFee=" +
    swapFeePercentage;
  return await service.getSwapQuote(params, EthereumProviderEnum.ZEROEX);
};

export const swapWithQuote = async (quote: ZeroExSwapQuote, address: string, signer: MPCSigner) => {
  const transaction = {
    data: quote.data,
    to: quote.to,
    value: quote.value,
    from: address,
    gasPrice: quote.gasPrice,
  };
  return await signer.sendTransaction(transaction);
};
