import './css/Home.css';
import { useContext, useEffect, useState } from 'react';
import {
  Button,
  Panel,
} from '@vkontakte/vkui';
import { showAds } from '../utils/utils';
import { UserContext } from '../store/user-context';
import api from '../utils/api';
import Header from './../components/header'
import { shuffle } from 'lodash';

const MAX_COUNT = 16; // Количество фото которые будут загркжены/подгружены

const Home = ({ id, go, folders, setActiveFolder }) => {

  const [offset, setOffset] = useState(0);
  const { user } = useContext(UserContext);

  useEffect(() => {

    if (!user || !user.photo_max_orig) {
      go('get_image');
      return;
    }

    if (!user?.limits.limit) {
      go('limit');
      return
    }

  }, [user]);

  const getPhotos = async () => {
    await showAds(); // Показываем interstitial рекламу (5 сек), можно передать "reward" тогда будет загружена более дорогоая реклама (30с)
    setOffset(offset + MAX_COUNT); // Подгружаем еще фото с помощью смещения
  };

  const batchFolders = folders.slice(0, offset + MAX_COUNT)
  const childElements = batchFolders.map(folder => {
    
    const photo = folder.photos[0]

    return (
      <div className="Card">
        <div
          key={folder.path}
          onClick={() => {
            setOffset(0);
            setActiveFolder({...folder, photos: shuffle(folder.photos)});
            go("images")
          }}
          style={{
            textAlign: "center"
          }}
          className='CardInner'
        >
          <div className="PhotoInner">
            <img
              className="MainPhoto"
              src={api.getImage(photo.name)}
            />
          </div>
          <div className="CardText">
            <h4>{folder.name}</h4>
          </div>
        </div>
      </div>
    );
  });
  
  const hasMoreFolders = folders.length > offset + MAX_COUNT;
  
  return (
    <Panel id={id} style={{ minHeight: '100vh' }}>
      <Header title="Выберите категорию" back={false} />
      <div className="home">
      {childElements}
      </div>

      {hasMoreFolders ? (
        <div>
          <Button
	          type="button"
            className="DefaultButton"
            onClick={getPhotos}
            stretched
            size="l"
          >
            Загрузить еще
          </Button>
        </div>
      ) : null}
    </Panel>
  );
};

export default Home;
