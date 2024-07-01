import { Panel, Button } from '@vkontakte/vkui';
import { useContext, useState } from 'react';
import { UserContext } from '../store/user-context';
import { showAds } from '../utils/utils';
import Header from '../components/header';
import api from '../utils/api';
import Masonry from 'react-masonry-component';

const MAX_COUNT = 16; // Количество фото которые будут загркжены/подгружены

export default function Images({ id, go, folder, setAva, setActivePhoto, goBack }) {
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  const loadingTimeout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const getPhotos = async () => {
    await showAds(); // Показываем interstitial рекламу (5 сек), можно передать "reward" тогда будет загружена более дорогоая реклама (30с)
    loadingTimeout();
    setOffset(offset + MAX_COUNT); // Подгружаем еще фото с помощью смещения
  };
  const photosBatch = folder.photos.slice(0, offset + MAX_COUNT)

  const childElements = photosBatch.map(photo => {
    return (
      <div
        key={photo.name}
        onClick={() => {
          fetch(user?.photo_max_orig as string)
            .then((res) => res.blob())
            .then((blob) => {
              setAva(blob);
              setActivePhoto(photo);
              go('source');
            });
        }}
        className='Image'
      >
        <img
          className="MainPhoto"
          src={api.getImage(photo.name)}
        />
      </div>
    );
  });

  const hasMorePhotos = folder.photos.length > offset + MAX_COUNT;

  return (
    <Panel id={id} style={{ minHeight: '100vh' }}>
      <Header title="Выберите образ" back={true} goBack={goBack}/>
      <div className='images'>{childElements}</div>

      {hasMorePhotos ? (
          <Button
	          type="button"
            onClick={getPhotos}
            appearance='accent'
            stretched
            size="l"
          >
            Загрузить еще
          </Button>
      ) : null}
    </Panel>
  );

}
