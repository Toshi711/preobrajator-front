import ReactDOM from 'react-dom';
import bridge from '@vkontakte/vk-bridge';
import App from './App';

console.log('init')

const runApplicationParams = new URLSearchParams(window.location.search);

window.process = {
  APP_ID: Number(runApplicationParams.get('vk_app_id')), // ID приложения
  ALBUM: 'Мой Образ', // Название альбома который будется создавться дл япубликации фото,
};

console.log('connected')

// Init VK Mini App
bridge.send('VKWebAppInit')
.then((data) => { 
  console.log(data)
})
.catch((error) => {
  // Ошибка
  console.log(error);
});

// Показ рекламы внизу запустится сразу при открытии приложения
bridge.send('VKWebAppShowBannerAd', {
   banner_location: 'bottom',
});

ReactDOM.render(<App />, document.getElementById('root'));

import('./eruda').then(({ default: eruda }) => {}); //runtime download
