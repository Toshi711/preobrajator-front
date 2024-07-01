import { Panel, File, Button, Alert } from '@vkontakte/vkui';
import { useContext, useEffect } from 'react';
import { UserContext } from '../store/user-context';
import api from '../utils/api';
import Header from '../components/header';

export default function Source({ id, go, setAva, setPopout, setActivePhoto, activePhoto, goBack}) {

  const { user } = useContext(UserContext);

  const closePopout = () => {
    setPopout(null);
  };

  const openAction = () => {
    setPopout(
      <Alert
        actions={[
          {
            title: 'Ок',
            mode: 'destructive',
            action: () => { 
              setPopout(null)
            }
          },
        ]}
        actionsLayout="vertical"
        onClose={closePopout}
        header="Ошибка" 
        text="Не подходящий формат файла, попробуйте выбрать другой"
      />,
    );
  };

  const getPhoto = (e) => {

    const file = e.target.files[0]

    if(!/image\/.+/.test(file.type)){
      openAction()
      return
    }

    setAva(file);
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
