/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends NavigationRoutes {}
  }
}

export type NavigationRoutes = {
  Welcome: undefined;
 // Root: NavigatorScreenParams<RootTabParamList> | undefined;
  //Modal: undefined;
  //NotFound: undefined;
};


export type RootTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};