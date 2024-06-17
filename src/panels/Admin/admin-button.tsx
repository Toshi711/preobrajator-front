import { Button, Header, Select, useAppearance, Input, ModalPage, ModalPageHeader, Group, CellButton, ModalRoot, SplitLayout, FormItem} from '@vkontakte/vkui';
import { Icon12Crown } from '@vkontakte/icons';
import { useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import Editor from 'react-simple-code-editor';
import api from '../../utils/api';
import Masonry from 'react-masonry-component';
import { Directory } from './categories';
import Categories from './categories';

const hightlightWithLineNumbers = (input) => {
  return input ? input.split("\n").map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`).join("\n") : ""
}

export default function AdminButton() {

  const appearance = useAppearance();

  const [panel, setPanel] = useState(false)
  const [loading, setLoading] = useState(true)
  const [directories, setDirectories] = useState<Directory[]>([])
          
  const { handleSubmit, control, reset } = useForm({
    defaultValues: async () => {
      const config = await api.getConfig()
      const directories = await api.getDirectories()
      const text = {...config, groupids: config.groupids ? config.groupids.join('\n') : "", group: String(config.group)} 
      
      setLoading(false)
      setDirectories(directories)
      reset(text)
      return text
    }
  })

  const onSubmit = async data => {
    const groups = data.groupids.split('\n').map(Number)
    const group = Number(data.group)
    if(!isNaN(group)){
      await api.updateConfig({...data, groupids: groups, group})
    }
  }

  return <div>

    <Button width={25} height={25} before = {<Icon12Crown/>} appearance='accent' mode='outline' onClick={() => setPanel(!panel)}></Button>
   
    <div className='admin form' style={{width: `${window.innerWidth / 2}px`, position: "absolute", display: panel ? 'flex' : 'none',left: 0,padding: "20px",background: appearance == 'light' ? 'white' : '#222222',flexDirection: "column",gap: '10px',alignItems: "flex-start"}}>

    <Categories directories={directories} setDirectories={setDirectories}/>

    {
      loading 
      ? "Загрузка..."
      : <>
      
      <Group className="group" mode='card'>

      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Настройки</h1>

        <FormItem htmlFor="group" top="Группа для рассылки" >
          <Controller defaultValue="" name="group" rules={{required: true}} control={control} render={({field}) => <Input id="group" value={String(field.value)} onChange={(e) => field.onChange(String(e.target.value))}/>}/>
        </FormItem>

        <Controller
          control={control}
          rules={{required: true}}
          defaultValue=''
          name="groupids"
          render={ ({field}) => {
            return <Editor 
                textareaId="codeArea"
                className="editor"
                highlight={code => hightlightWithLineNumbers(code) 
                  .split('\n')
                  .map(line =>
                      `<span class="container_editor_line_number">${line}</span>`
                  )
                  .join('\n')
                }
                onChange={field.onChange}
                onValueChange={field.onChange}
                value={field.value}
              />
          }}
        />

        <FormItem htmlFor="textphoto" top="Текст поста" >
          <Controller defaultValue="" name="textphoto" rules={{required: true}} control={control} render={({field}) => <Input id="textphoto" value={field.value} onChange={field.onChange}/>}/>
        </FormItem>

        <FormItem htmlFor="textcaption" top="Описание фотографии" >
          <Controller defaultValue="" name="textcaption" rules={{required: true}} control={control} render={({field}) => <Input id="textcaption" value={field.value} onChange={field.onChange}/>}/>
        </FormItem>

        <FormItem htmlFor="repostWindowText" top="Текст окна репоста" >
          <Controller defaultValue="" name="repostWindowText" rules={{required: true}} control={control} render={({field}) => <Input id="repostWindowText" value={field.value} onChange={field.onChange}/>}/> 
        </FormItem>

        <FormItem htmlFor="repostButtonText" top="Текст кнопки репоста" >
          <Controller defaultValue="" name="repostButtonText" rules={{required: true}} control={control} render={({field}) => <Input id="repostButtonText" value={field.value} onChange={field.onChange}/>}/>
        </FormItem>

        <FormItem htmlFor="confirmationWindowText" top="Текст окна рассылки" >
          <Controller defaultValue="" name="confirmationWindowText" rules={{required: true}} control={control} render={({field}) => <Input id="confirmationWindowText" value={field.value} onChange={field.onChange}/>}/>
        </FormItem>

        <FormItem htmlFor="confirmationButtonText" top="Текст кнопки рассылки" >
          <Controller defaultValue="" name="confirmationButtonText" rules={{required: true}} control={control} render={({field}) => <Input id="confirmationButtonText" value={field.value} onChange={field.onChange}/>}/>
        </FormItem>
        
        <FormItem htmlFor="subscribeWindowText" top="Текст окна подписки" >
          <Controller defaultValue="" name="subscribeWindowText" rules={{required: true}} control={control} render={({field}) => <Input id="subscribeWindowText" value={field.value} onChange={field.onChange}/>}/>
        </FormItem>

        <FormItem htmlFor="subscribeButton" top="Текст кнопки подписки" >
          <Controller defaultValue="" name="subscribeButton" rules={{required: true}} control={control} render={({field}) => <Input id="subscribeButton" value={field.value} onChange={field.onChange}/>}/>
        </FormItem>

        <FormItem htmlFor="storiesWindowText" top="Текст окна сториз" >
          <Controller defaultValue="" name="storiesWindowText" rules={{required: true}} control={control} render={({field}) => <Input id="storiesWindowText" value={field.value} onChange={field.onChange}/>}/>
        </FormItem>

        <FormItem htmlFor="example" top="Текст кнопки сториз" >
          <Controller defaultValue="" name="storiesButtonText" rules={{required: true}} control={control} render={({field}) => <Input id="storiesButtonText" value={field.value} onChange={field.onChange}/>}/> 
        </FormItem>

        <Button size='l' type='submit' className='controller'>Сохранить</Button>
       </form>
      </Group>
      </>
    }
      
    </div>
  </div>
}
