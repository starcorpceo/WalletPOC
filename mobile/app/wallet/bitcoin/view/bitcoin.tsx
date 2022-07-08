import React from "react";
import Wallets from "wallet/wallet-view";
import CreateBitcoinWallet from "./create/create";
import BitcoinWalletList from "./list/wallet-list";

const Bitcoin = () => {
  return (
    <Wallets name="Bitcoin">
      <BitcoinWalletList />
      <CreateBitcoinWallet />
    </Wallets>
  );
};

export default Bitcoin;
