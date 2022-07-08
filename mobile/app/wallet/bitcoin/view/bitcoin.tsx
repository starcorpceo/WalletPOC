import React from "react";
import Wallets from "wallet/wallet-view";
import CreateBitcoinWallet from "./create/create";
import BitcoinWalletListView from "./list/wallet-list";

const Bitcoin = () => {
  return (
    <Wallets name="Bitcoin">
      <BitcoinWalletListView />
      <CreateBitcoinWallet />
    </Wallets>
  );
};

export default Bitcoin;
