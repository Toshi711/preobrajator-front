import { shareHistory, showAds } from '../../utils/utils';
import { Icon28StoryCircleFillViolet } from '@vkontakte/icons';
import { Button, ButtonGroup } from '@vkontakte/vkui';
import { useContext, useEffect } from 'react';
import { GenerationResultContext } from '../../store/generation-result-context';
import { UserContext } from '../../store/user-context';
import api from '../../utils/api';

export interface HistoryPublicationProps {
  setPanel: (string) => void;
  go: (string) => void;
}

export const HistoryPublication = ({
  setPanel,
  go,
}: HistoryPublicationProps) => {
  const { generationResult } = useContext(GenerationResultContext);
  const { config } = useContext(UserContext)

  useEffect(() => {
    if (!generationResult) {
      go('error_panel');
      return;
    }
  }, [generationResult]);

  const share = async () => {
    try {
      await shareHistory(
        generationResult?.photo.absolutePath as string,
        generationResult?.basePhotoStartupLink || ''
      );

      await showAds(false);
      setPanel('GenerationResult');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="InitMenu">
      <button
        type="button"
        onClick={async () => {
          await showAds(false);
          setPanel('GenerationResult');
        }}
        
        className="SkipButton"
      >
        Отказаться
      </button>

      <img src={api.getImage('system/stories.png')} alt="" />
      <div className="Buttons">

        <h1>
          {config?.storiesWindowText}
        </h1>
        
        <Button size="l"  type="button" appearance='positive' className="DefaultButton" onClick={share}>
          {config?.storiesButtonText}
        </Button>
      </div>

    </div>
  );
};
