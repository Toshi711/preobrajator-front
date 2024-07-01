import { shareHistory, showAds } from '../../utils/utils';
import { Button, Panel } from '@vkontakte/vkui';
import { useContext, useEffect, useState } from 'react';
import { GenerationResultContext } from '../../store/generation-result-context';
import { UserContext } from '../../store/user-context';
import api from '../../utils/api';

export interface HistoryPublicationProps {
  go: (string) => void;
  id: string
}

export const HistoryPublication = ({
  id,
  go,
}: HistoryPublicationProps) => {
  const { generationResult } = useContext(GenerationResultContext);
  const { config } = useContext(UserContext)
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
      await shareHistory(
        generationResult?.photo.absolutePath as string,
        generationResult?.basePhotoStartupLink || ''
      );

      go('GenerationResult');
    } catch (e) {
      console.error(e);
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <Panel id={id} style={{ minHeight: '100vh' }}>
      <div className="InitMenu">
        <img src={api.getImage('system/stories.png')} alt="" />
        <div className="Buttons">

          <h1>
            {config?.storiesWindowText}
          </h1>
          
          <Button size="l"  type="button" appearance='positive' className="DefaultButton" onClick={share} loading={loading}>
            {config?.storiesButtonText}
          </Button>

          <Button
              type="button"
              size="l"
              appearance='accent'
              onClick={async () => {
                go('GenerationResult');
              }}
            >
              Отказаться
            </Button> 
        </div>

      </div>
    </Panel>
  );
};
