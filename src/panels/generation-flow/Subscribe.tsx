import { useContext, useEffect, useLayoutEffect } from 'react';
import { UserContext, UserInterface } from '../../store/user-context';
import { showAds } from '../../utils/utils';
import { SubscribeButton } from '../../components/subscribe-button';
import bridge, { EAdsFormats } from '@vkontakte/vk-bridge';
import api from '../../utils/api';
import { Panel } from '@vkontakte/vkui';

export interface SubscribeProps {
  go: (number) => void;
  id: string
}

const showAdd = async (user: UserInterface, setPanel) => {
  if (!user?.limits.groupIds.length) {
    await showAds(false, EAdsFormats.REWARD);
    setPanel('Share');
  }
};

export const Subscribe = ({ id, go }: SubscribeProps) => {
  const { user, setUser, config} = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      go('error_panel');
      return;
    }
  }, [user]);

  useLayoutEffect(() => {
    if (!user) {
      go('Share');
      return;
    }

    showAdd(user, go);
  }, [user]);

  const onSubscribe = () => {
    go('Share');
  };

  return (
    <Panel id={id} style={{ minHeight: '100vh' }}>
      <div className="InitMenu">
        <button
          type="button"
          onClick={async () => {
            await showAds(false);
            go('Share');
          }}
          className="SkipButton"
        >
          Отказаться  
        </button>
        <img src={api.getImage('system/subscribe.png')} alt="" />
        <div className="Buttons">
            <h1>{config?.subscribeWindowText}</h1>
            <SubscribeButton
              onSubscribe={onSubscribe}
              user={user!}
              setUser={setUser}
              bridge={bridge}
            >
              {config?.subscribeButton}
            </SubscribeButton>
        </div>
      </div>
    </Panel>
  );
};
