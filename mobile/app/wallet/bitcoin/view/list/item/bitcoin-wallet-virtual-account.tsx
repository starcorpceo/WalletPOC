import { BitcoinWallet } from "bitcoin/.";
import React from "react";
import { Button, Text } from "react-native";

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
