import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistStorage } from "recoil-persist";

export const CustomStorage: PersistStorage = {
  setItem: (key: string, value: string): void | Promise<void> => {
    return AsyncStorage.setItem(key, value);
  },

  mergeItem: (key: string, value: string): Promise<void> => {
    return mergeItem(key, value);
  },

  getItem: async (key: string): Promise<string> => {
    const item = await AsyncStorage.getItem(key);

    if (item == null) {
      return "";
    }

    return item;
  },
};

const mergeItem = AsyncStorage.mergeItem
  ? AsyncStorage.mergeItem
  : async (key: string, value: string): Promise<void> => {
      const oldValue = await AsyncStorage.getItem(key);
      if (oldValue) {
        const oldObject = JSON.parse(oldValue);
        const newObject = JSON.parse(value);
        const nextValue = JSON.stringify({ ...oldObject, ...newObject });
        AsyncStorage.setItem(key, nextValue);
      } else {
        AsyncStorage.setItem(key, value);
      }
    };
