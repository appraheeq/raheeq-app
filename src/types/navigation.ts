import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Adhkar: { initialCategory?: 'morning' | 'evening' } | undefined;
  Tasbeeh: undefined;
  History: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  About: undefined;
};
