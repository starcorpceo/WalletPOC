import { BitcoinWallet } from "bitcoin/types/bitcoin";
import React from "react";
import { Button } from "react-native";

type BitcoinVirtualAccountProps = {
  wallet: BitcoinWallet;
};

export const BitcoinVirtualAccount = ({
  wallet,
}: BitcoinVirtualAccountProps) => {
  const connectToVirtualAccount = () => {
    console.log("connecting to virutal account...");
  };

  return (
    <>
      <Button
        onPress={connectToVirtualAccount}
        title="Connect to Tatum Virtual Account"
      />
    </>
  );
};
