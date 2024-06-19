import { showAds, wallPost } from '../../utils/utils';
import { Button, Panel } from '@vkontakte/vkui';
import { useContext, useEffect } from 'react';
import { GenerationResultContext } from '../../store/generation-result-context';
import { UserContext } from '../../store/user-context';
import api from '../../utils/api';
  
export interface ShareProps {
  go: (string) => void;
  id: string
}

export const Share = ({ id, go }: ShareProps) => {
  const { generationResult } = useContext(GenerationResultContext);
  const { config, user } = useContext(UserContext)

  useEffect(() => {
    if (!generationResult) {
      go('error_panel');
      return;
    }
  }, [generationResult]);

  const share = async () => {
    try {
      await wallPost(
        generationResult?.textPhoto,
        generationResult?.textCaption,
        generationResult?.photo.relativePath,
      );
      await showAds(false);

      if(!user?.limits.groupSubscription){
        go('Confirmation');
      }
      else {
        go('HistoryPublication')  
      }

    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Panel id={id} style={{ minHeight: '100vh' }}>
      <div className="InitMenu">
        <button
          type="button"
          onClick={async () => {
            await showAds(false);
            if(!user?.limits.groupSubscription){
              go('Confirmation');
            }
            else {
              go('HistoryPublication')  
            }
          }}
          
          className="SkipButton"
        >
          Отказаться
        </button>

        <img src={api.getImage('system/repost.png')} alt="" />

        <div className="Buttons">
          <h1>
            {config?.repostWindowText}
          </h1>
            <Button size="l" type="button" appearance='positive' className="DefaultButton" onClick={share}>
              {config?.repostButtonText}
            </Button>
        </div>
      </div>

    </Panel>
  );
};
