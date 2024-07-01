import { useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
  View,
  ScreenSpinner,
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  SplitLayout,
  SplitCol,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Home from './panels/Home';
import Init from './panels/Init';
import api from './utils/api';
import Limit from './panels/Limit';
import Generate from './panels/Generate';
import NotFace from './panels/NotFace';
import Source from './panels/Source'
import ErrorBoundary from './error-boundary';
import { Config, UserContext, UserInterface } from './store/user-context';
import {
  GenerationResultInterface,
  GenerationResultContext,
} from './store/generation-result-context';
import {
  FolderInterface,
  FolderPhotoInterface,
} from './store/folder.interface';
import Images from './panels/Images'
import ErrorPanel from './panels/Error';

import { Subscribe } from './panels/generation-flow/Subscribe';
import { Share } from './panels/generation-flow/Share';
import { HistoryPublication } from './panels/generation-flow/HistoryPublication';
import { Confirmation } from './panels/generation-flow/Confirmation';
import { GenerationResult } from './panels/generation-flow/GenerationResult';

const App = () => {

  const [history, setHistory] = useState<string[]>([])
  const [activePanel, setActivePanel] = useState('init');
  const [fetchedUser, setUser] = useState<UserInterface | null>(null);
  const [popout, setPopout] = useState<JSX.Element | null>(<ScreenSpinner size="large" />,);
  const [folders, setFolders] = useState<FolderInterface[]>([]); // Все папки с шаблонами
  const [activePhoto, setActivePhoto] = useState<FolderPhotoInterface>(); // Текущий выбранный шаблон для редактирования
  const [ava, setAva] = useState<Blob>(); // Автарка пользователя для обработки
  const [generationResult, setGenerationResult] = useState<GenerationResultInterface | null>(null);
  const [activeFolder, setActiveFolder] = useState<FolderInterface | null>(null);
  const [config, setConfig] = useState<Config | null>(null)

  async function fetchData() {
    const user = await bridge.send('VKWebAppGetUserInfo'); // Инициализация пользователя
    const fetchedFolders = await api.getFolders(user as UserInterface); // Получаем папки
    const limits = await api.getUserLimits(); // Получаем лимит
    const config = await api.getConfig()

    setConfig(config)
    if (limits.generationResult) {
      setGenerationResult(limits.generationResult);
    }
    setFolders(fetchedFolders);
    setUser({
      ...user,
      limits: { ...limits.limits },
    });
    setPopout(null);
  }

  const go = (e) => {
    const panel = typeof e === 'string' ? e : e.currentTarget.dataset.to
    window.history.pushState( { panel }, panel )
    history.push( panel ); 
    setActivePanel(panel);
  };

  const goBack = () => {
    if( history.length === 1 ) {  // Если в массиве одно значение:
      bridge.send("VKWebAppClose", {"status": "success"}); // Отправляем bridge на закрытие сервиса.
    } else if( history.length > 1 ) { // Если в массиве больше одного значения:
      history.pop() // удаляем последний элемент в массиве.
      setActivePanel( history[history.length - 1] ) // Изменяем массив с иторией и меняем активную панель.
    }
  }

  useEffect(() => {
    window.addEventListener('popstate', goBack)
    return () => window.removeEventListener('popstate', goBack)
  }, [])

  return (
    <ErrorBoundary>
      <ConfigProvider isWebView={true}>
        <AdaptivityProvider>
          <AppRoot>
            <UserContext.Provider value={{ user: fetchedUser, setUser, config }}>
              <GenerationResultContext.Provider
                value={{ generationResult, setGenerationResult }}
              >
                <SplitLayout popout={popout}>
                  <SplitCol>
                    <View activePanel={activePanel}>
                      <Init id="init" go={go} fetchData={fetchData} />
                      <Home
                        id="home"
                        go={go}
                        folders={folders}
                        setActiveFolder={setActiveFolder}
                      />
                      <Limit id="limit" go={go} />
                      <Generate
                        id="generate"
                        photo={activePhoto as FolderPhotoInterface}
                        go={go}
                        ava={ava as Blob}
                      />
                      <Source
                        id="source"
                        go={go}
                        setAva={setAva}
                        setActivePhoto={setActivePhoto}
                        activePhoto={activePhoto}
                        goBack={goBack}
                        setPopout={setPopout}
                      />
                      <Images
                        id="images"
                        go={go}
                        folder={activeFolder}
                        setAva={setAva}
                        setActivePhoto={setActivePhoto}
                        goBack={goBack}
                      />
                      <NotFace id="get_image" setAva={setAva} go={go} />
                      <ErrorPanel id="error_panel" go={go} />
                      <Subscribe id="Subscribe" go={go} />
                      <Share id="Share" go={go}/>
                      <HistoryPublication id="HistoryPublication" go={go}/>
                      <Confirmation id="Confirmation" go={go}/>
                      <GenerationResult id="GenerationResult" go={go}/>
                    </View>
                  </SplitCol>
                </SplitLayout>
              </GenerationResultContext.Provider>
            </UserContext.Provider>
          </AppRoot>
        </AdaptivityProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
};

export default App;
