import { Panel, File, Button } from '@vkontakte/vkui';
import { Icon20StoryFillCircleRed } from '@vkontakte/icons';
import { useContext } from 'react';
import { UserContext } from '../store/user-context';
import api from '../utils/api';

export default function NotFace({ id, go, setAva }) {

  const {user} = useContext(UserContext)

  const getPhoto = (e) => {
    setAva(e.target.files[0]);
    go('generate');
  };

  return (
    <Panel id={id} style={{ minHeight: '100vh' }}>
      <div className="InitMenu">

        <img src={api.getImage('system/error.png')} alt="" />

        <div className="Buttons">

          <h1>
            Не удалось определить лицо на аватарке. Попробуйте другое фото из галереи или обновите аватарку. На фото должно быть 1 лицо в хорошем качестве
          </h1>
          
          <Button
              size="l"
              type="button"
              appearance='accent'
              onClick={() => {
                fetch(user?.photo_max_orig as string)
                  .then((res) => res.blob())
                  .then((blob) => {
                    setAva(blob);
                    go('generate');
                  });
                go('image')
              }}
            >
              Свое фото с аватара
          </Button>

          <File
            accept="image/png, image/gif, image/jpeg"
            size="l"
            align='center'
            onChange={getPhoto}
          >
            Открыть галерею
          </File>
        </div>
      </div>
    </Panel>
  );
}
