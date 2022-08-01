import { KeyShareType } from "shared/mpc";

interface IConstants {
  deviceKeyName: string;
  bip44MasterIndex: string;
  bip44PurposeIndex: string;
  bip44BitcoinCoinType: string;
}

//TODO PurposeIndex should be 44, causes an mpc error currently. Fix error and change to 44
const constants: IConstants = {
  deviceKeyName: "WalletPOCDeviceKey",
  bip44MasterIndex: "m",
  bip44PurposeIndex: "44",
  bip44BitcoinCoinType: "1",
};

export const emptyMasterKeyPair = {
  id: "",
  path: "",
  keyShare: "",
  type: KeyShareType.MASTER,
};

export default constants;
