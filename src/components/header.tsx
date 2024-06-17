

import { PanelHeader } from '@vkontakte/vkui';
import { Icon28ChevronLeftOutline } from '@vkontakte/icons';
import AdminButton from '../panels/Admin/admin-button';
import api from '../utils/api';
import { useEffect, useState } from 'react';

export default function Header(props) {
  const [status, setStatus] = useState(null)

  useEffect(() => {
    async function fetch() {
      const status = await api.isAdmin()
      setStatus(status)
    }

    fetch()
  })

  return (
    <PanelHeader 
      before={ props.back ? <Icon28ChevronLeftOutline
      width={25}
      height={25}
      onClick={props.goBack}
      className="BackButton"
    /> : null}> <span style={{display: "flex", alignItems: 'center', gap: "15px"}}>{props.title} {status ? <AdminButton/> : null}</span></PanelHeader>
  );
}
