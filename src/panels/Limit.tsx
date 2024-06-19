import { Button, ButtonGroup, Panel } from '@vkontakte/vkui';
import { MessagesConfirmation, showAds, wallPost } from '../utils/utils';
import { useContext, useEffect, useState } from 'react';
import { UserContext, UserInterface } from '../store/user-context';
import { GenerationResultContext } from '../store/generation-result-context';
import { SubscribeButton } from '../components/subscribe-button';
import { EAdsFormats } from '@vkontakte/vk-bridge';
import Header from '../components/header';
import bridge from '@vkontakte/vk-bridge';

export default function Limit({ id, go }) {
  const [ loading, setLoading ] = useState(false);
  const { config, user, setUser } = useContext(UserContext);
  const { generationResult } = useContext(GenerationResultContext)
  useEffect(() => {
    if (!user || !generationResult) {
      go('error_panel');
      return;
    }

  }, [user, generationResult]);

  const SharePost = async () => {
    setLoading(true);

    try {
      await wallPost(
        generationResult?.textPhoto,
        generationResult?.textCaption,
        generationResult?.photo.relativePath,
      );
      await showAds(false, EAdsFormats.REWARD);
    } catch (e) {
      console.error(e);
    }
    
    setLoading(false);
  };

  const onSubscribe = async () => {
    await showAds(false);
    go('init');
  };

  return (
    <Panel id={id} style={{ minHeight: '100vh' }}>
      <Header title="Лимит" back={false} />

      <div className="InitMenu">

        <img
          src={generationResult?.photo.absolutePath}
          style={{ width: '250px' }}
        />

        <div className="Buttons">
          <h1>
            К сожалению, на сегодня ваш лимит на образы исчерпан. Пожалуйста,
            заходите завтра
          </h1>

          {user?.limits?.groupIds?.length ? (
            <SubscribeButton
              onSubscribe={onSubscribe}
              user={user as UserInterface}
              setUser={setUser}
              bridge={bridge}
            >
              Получить +1 Образ
            </SubscribeButton>
          ) : null}

          <Button
            size="l"
            loading={loading}
            className={'DefaultButton'}
            onClick={SharePost}
          >
            Поделиться с друзьями
          </Button>

          {!user?.limits.groupSubscription &&  (
          <Button appearance='accent' size='l' onClick={async () => {
            await MessagesConfirmation(Number(config?.group))

            if(user?.limits){
              setUser({...user, limits: {...user.limits, groupSubscription: true}})
            }
            }}>
              Получать в сообщениях больше образов
            </Button>
          )}
        </div>
      </div>
    </Panel>
  );
}
