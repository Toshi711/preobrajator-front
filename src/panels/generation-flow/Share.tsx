import { showAds, wallPost } from '../../utils/utils';
import { Button, Panel } from '@vkontakte/vkui';
import { useContext, useEffect, useState } from 'react';
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
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    if (!generationResult) {
      go('error_panel');
      return;
    }
  }, [generationResult]);

  const share = async () => {
    try {
      setLoading(true)
      await wallPost(
        generationResult?.textPhoto,
        generationResult?.textCaption,
        generationResult?.photo.relativePath,
      );

      if(!user?.limits.groupSubscription){
        go('Confirmation');
      }
      else {
        go('HistoryPublication')  
      }

    } catch (e) {
      console.error(e);
    }
    finally {
      setLoading(false)
    }
  };

  return (
    <Panel id={id} style={{ minHeight: '100vh' }}>
      <div className="InitMenu">
        <img src={api.getImage('system/repost.png')} alt="" />

        <div className="Buttons">
          <h1>
            {config?.repostWindowText}
          </h1>
            <Button size="l" type="button" appearance='positive' className="DefaultButton" onClick={share} loading={loading}>
              {config?.repostButtonText}
            </Button>
            <Button
              type="button"
              size="l"
              appearance='accent'
              onClick={async () => {
                if(!user?.limits.groupSubscription){
                  go('Confirmation');
                }
                else {
                  go('HistoryPublication')  
                }
              }}
            >
              Отказаться
            </Button> 
        </div>
      </div>

    </Panel>
  );
};
