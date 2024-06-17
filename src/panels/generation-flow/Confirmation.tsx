import { MessagesConfirmation, showAds } from '../../utils/utils';
import { Button } from '@vkontakte/vkui';
import { useContext, useEffect } from 'react';
import { GenerationResultContext } from '../../store/generation-result-context';
import { UserContext } from '../../store/user-context';
import api from '../../utils/api';

export const Confirmation = ({ setPanel, go }) => {
  const { generationResult } = useContext(GenerationResultContext);
  const { config, user, setUser} = useContext(UserContext)

  useEffect(() => {
    if (!generationResult) {
      go('error_panel');
      return;
    }
  }, [generationResult]);

  return (
    <div className="InitMenu">
      <button
         type="button"
        onClick={async () => {
          await showAds()
          setPanel('HistoryPublication');
        }}
        className="SkipButton"
      >
        Отказаться
      </button> 

      <img src={api.getImage('system/confirmation.png')} alt="" />

      <div className="Buttons">
        <h1>
          {config?.confirmationWindowText}
        </h1>
          <Button  type="button" size="l" appearance='positive' onClick={async () => {
            await MessagesConfirmation(Number(config?.group))

            if(user?.limits){
              setUser({...user, limits: {...user.limits, groupSubscription: true}})
            }
            setPanel('HistoryPublication')
          }}>
            {config?.confirmationButtonText}
          </Button>
      </div>
    </div>
  );
};
