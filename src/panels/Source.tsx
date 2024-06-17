import { Panel, File, Button } from '@vkontakte/vkui';
import { Icon24Camera } from '@vkontakte/icons';
import { Icon20StoryFillCircleRed } from '@vkontakte/icons';
import { useContext } from 'react';
import { UserContext } from '../store/user-context';
import api from '../utils/api';
import Header from '../components/header';

export default function Source({ id, go, setAva, setActivePhoto, activePhoto, goBack}) {

  const { user } = useContext(UserContext);

  const getPhoto = (e) => {
    setAva(e.target.files[0]);
    go('generate');
  };

  return (
    <Panel id={id} style={{ minHeight: '100vh' }}>
      <Header title="Выберите образ" back={true} goBack={goBack}/>

      <div className="InitMenu">

        <img src={api.getImage(activePhoto.name)} alt="" />

        <div className="Buttons">

        <h3>
          Какое фото использовать для этого образа?
        </h3>
        <Button
            size="l"
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
          onChange={getPhoto}
          align='center'
          size='l'
          appearance='accent'
        >
          Загрузить с устройства
        </File>
        </div>

      </div>
    </Panel>
  );
}
