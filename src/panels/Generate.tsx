import { ScreenSpinner, Panel } from '@vkontakte/vkui';
import {
  useContext,
  useEffect,
} from 'react';
import { showAds } from '../utils/utils';
import api from '../utils/api';
import { LimitError, FaceNotFound } from '../utils/exceptions';
import { UserContext } from '../store/user-context';
import {
  GenerationResultContext,
  GenerationResultInterface,
} from '../store/generation-result-context';
import { FolderPhotoInterface } from '../store/folder.interface';

export interface GenerateProps {
  id: string;
  photo: FolderPhotoInterface;
  go: any;
  ava: Blob;
}

export default function Generate({ id, photo, go, ava }: GenerateProps) {
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

        go('Subscribe');

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

  return (
    <Panel id={id} style={{ minHeight: '100vh' }}>
      <div className="InitMenu">
        <h1 className="loading-text" style={{ marginBottom: '200px' }}>
          Пожалуйста, подождите. Идет создание вашего нового образа...
        </h1>
        <ScreenSpinner />
      </div>
    </Panel>
  );
}
