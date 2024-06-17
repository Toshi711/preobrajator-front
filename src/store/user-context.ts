import React, { Dispatch, SetStateAction } from 'react';
import { UserInfo } from '@vkontakte/vk-bridge';

export interface Config {
  groupids: number[]
  group: number
  textphoto: string
  textcaption: string
  repostWindowText: string
  repostButtonText: string
  confirmationWindowText: string
  confirmationButtonText: string
  subscribeWindowText: string
  subscribeButton: string
  storiesWindowText: string
  storiesButtonText: string
}

export interface UserLimitInterface {
  limit: number;
  groupIds: number[];
  groupSubscription: boolean
}

export type UserInterface = UserInfo & {
  limits: UserLimitInterface;
};

export const UserContext = React.createContext<{
  user: UserInterface | null;
  setUser: Dispatch<SetStateAction<UserInterface | null>>;
  config: Config | null
}>({
  setUser: () => {},
  user: null,
  config: null
});
