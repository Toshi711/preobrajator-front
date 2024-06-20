import { MessagesConfirmation, showAds, wallPost } from '../../utils/utils';
import { Button, ButtonGroup, Panel } from '@vkontakte/vkui';
import React, { useContext, useEffect } from 'react';
import { GenerationResultContext } from '../../store/generation-result-context';
import { UserContext, UserInterface } from '../../store/user-context';
import { SubscribeButton } from '../../components/subscribe-button';
import bridge, { EAdsFormats } from '@vkontakte/vk-bridge';

export interface GenerationResultProps {
  go: (string) => void;
  id: string
}

export const GenerationResult = ({ id, go }: GenerationResultProps) => {
  const { generationResult } = useContext(GenerationResultContext);
  const { config, user, setUser } = useContext(UserContext);

  useEffect(() => {

    if (!user || !generationResult) {
      go('error_panel');
      return;
    }

  }, [generationResult, user]);

  const share = async () => {
    try {
      await wallPost(
        generationResult?.textPhoto,
        generationResult?.textCaption,
        generationResult?.photo.relativePath,
      );

      go('HistoryPublication');
    } catch (e) {
      console.error(e);
    }
  };

  const onSubscribe = async () => {
    go('init');
  };

  return (
    <Panel id={id} style={{ minHeight: '100vh' }}>

      <div className="InitMenu">
        <img
          src={generationResult?.photo.absolutePath}
          style={{ width: '250px' }}
        />
        <div className="Buttons">

          <h1>
            Ваше преображение готово! Подпишитесь для получения дополнительного образа
          </h1>
          
          { user?.limits?.limit! > 0 ? 
            <Button
              type="button"
              onClick={async () => {
                go('init')
              }}
              size="l"
              appearance='positive'
            >
              Выбрать другой образ
            </Button>
            : user?.limits?.groupIds?.length ?  (
            <SubscribeButton
              onSubscribe={onSubscribe}
              user={user as UserInterface}
              setUser={setUser}
              bridge={bridge}
            >
              Подписаться +1 Образ
            </SubscribeButton>
          ) : null}

          <Button
            type="button"
            onClick={share}
            size="l"
            className={'DefaultButton'}
            stretched
          >
            Поделиться с друзьями
          </Button>

          {!user?.limits.groupSubscription &&  (
            <Button type="button" appearance='accent' size='l' onClick={async () => {
              await MessagesConfirmation(Number(config?.group))

              if(user?.limits){
                setUser({...user, limits: {...user.limits, groupSubscription: true}})
              }
            }}>
              Получать образы в сообщениях
            </Button>
          )}

        </div>
      </div>
    </Panel>
  );
};
