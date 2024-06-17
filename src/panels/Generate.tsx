import { Panel, ScreenSpinner } from '@vkontakte/vkui';
import {
  useContext,
  useEffect,
  useState,
} from 'react';
import { showAds } from '../utils/utils';
import api from '../utils/api';
import ErrorPanel from './Error';
import { LimitError, FaceNotFound } from '../utils/exceptions';
import { UserContext } from '../store/user-context';
import {
  GenerationResultContext,
  GenerationResultInterface,
} from '../store/generation-result-context';
import { FolderPhotoInterface } from '../store/folder.interface';
import { Subscribe } from './generation-flow/Subscribe';
import { Share } from './generation-flow/Share';
import { HistoryPublication } from './generation-flow/HistoryPublication';
import { GenerationResult } from './generation-flow/GenerationResult';
import { Confirmation } from './generation-flow/Confirmation';

const panels = {
  Subscribe,
  Share,
  HistoryPublication,
  GenerationResult,
  ErrorPanel,
  Confirmation
};

export interface GenerateProps {
  id: string;
  photo: FolderPhotoInterface;
  go: any;
  ava: Blob;
}

export default function Generate({ id, photo, go, ava }: GenerateProps) {
  const [panel, setPanel] = useState<string | null>(null);
  const { generationResult, setGenerationResult } = useContext(GenerationResultContext,);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      go('error_panel');
      return;
    }
  }, [user]);

  useEffect(() => {
    const poll = async (id: string) => {
      try {
        const job = await api.getResult(id);

        if (job === 'PENDING') {
          return setTimeout(poll, 3_000, id);
        }

        setGenerationResult({ ...generationResult, ...(job as GenerationResultInterface),});

        if (user) {
          setUser({
            ...user,
            limits: {
              ...user.limits,
              limit: user.limits.limit - 1,
            },
          });
        }

        setPanel('Subscribe');

      } catch (e) {
        if (e instanceof FaceNotFound) {
          go('get_image');
        } else {
          go('error_panel');
        }
      }
    };

    const start = async () => {
      try {
        const id = await api.generate(ava, photo);
        poll(id);
        await showAds(false);
      } catch (e) {
        if (e instanceof LimitError) {
          go('limit');
        } else {
          go('error_panel');
        }
      }
    };

    start();
  }, []);

  if (!panel){
    return (
      <div className="InitMenu">
        <h1 className="loading-text" style={{ marginBottom: '200px' }}>
          Пожалуйста, подождите. Идет создание вашего нового образа...
        </h1>
        <ScreenSpinner />
      </div>
    );
  }

  const ActivePanel = panels[panel];

  return (
    <Panel id={id}>
      <ActivePanel
        setPanel={setPanel}
        go={go}
      />
    </Panel>
  );
}
