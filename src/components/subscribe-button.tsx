import { Button } from '@vkontakte/vkui';
import api from '../utils/api';
import { UserInterface } from '../store/user-context';
import React, { Dispatch, SetStateAction, useState } from 'react';
import {showAds} from "../utils/utils";
import { VKBridge } from '@vkontakte/vk-bridge';

export interface SubscribeButtonProps {
  onSubscribe: () => void;
  setUser: Dispatch<SetStateAction<UserInterface | null>>;
  user: UserInterface;
  children: React.ReactNode;
  stretched?: boolean;
  bridge: VKBridge
}


const SUBSCRIBE_BATCH_SIZE = 3;

export const SubscribeButton = ({
  onSubscribe,
  setUser,
  user,
  children,
  stretched,
  bridge  
}: SubscribeButtonProps) => {
  
  const [loading, setLoading] = useState(false);

  const getPoints = async () => {
    setLoading(true);
    
    const groups = user.limits.groupIds.slice(0, SUBSCRIBE_BATCH_SIZE);

    if (!groups.length) {
      await showAds(false);
      onSubscribe();
      return;
    }
	
    const subscribedGroups: number[] = [];
    
    for (let i = 0; i < groups.length; i++) {

      const group_id = groups[i];
      if(!group_id) continue

      try {

        let data = await bridge.send('VKWebAppJoinGroup', {
          group_id	  
        });

        if (data.result) {
          subscribedGroups.push(group_id);
        }

      } catch (e) {
        console.error(e);
      }
    }

    if (subscribedGroups.length) {
      const newLimits = await api.updateUserLimit(subscribedGroups);

      setUser({
        ...user,
        limits: {
          ...user.limits,
          ...newLimits.limits,
        },
      });

      onSubscribe();
    }
    setLoading(false);
  };

  return (
    <Button
      type="button"
      onClick={getPoints}
      loading={loading}
      size="l"
      stretched={Boolean(stretched)}
      appearance='positive'
    >
      {children}
    </Button>
  );
};
