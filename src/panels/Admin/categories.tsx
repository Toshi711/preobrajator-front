import { Button, FormItem, Group, Input, Select } from "@vkontakte/vkui"
import api from "../../utils/api"
import { useForm } from "react-hook-form"
import { Controller } from "react-hook-form"


export interface Directory {
  name: string
  path: string
  sex: 'male' | 'female'
}

export default function Categories({directories, setDirectories}){

  const { handleSubmit, control } = useForm()

  const onSubmit = async data => {
    try{
      const result = await api.createDirectory(data)
      
      if(result){
        setDirectories([...directories, result])
      }
    }catch(e){
      console.log(e)
    }
  }

  return <Group className="group" mode='card'>
      <form onSubmit={handleSubmit(onSubmit)}>

        <h1>Категории</h1>
        { directories.map(directory => {
           return <Group mode='card' className='directory' separator='hide' key={directory.path}>
              <div className="directoryInner">
                  <h3>{directory.name} ({directory.sex == 'male' ? 'Мужской' : 'Женский'})</h3>
                  <h4>{directory.path}</h4>
                
                  <Button size='s' appearance='negative' onClick={async () => {
                    const status = await api.deleteDirectory(directory.path)
                    if(status){
                      setDirectories(directories.filter(d => d.path !== directory.path))
                    }
                  }}>Удалить</Button>

              </div>
          </Group>
        }) }

        <FormItem htmlFor="sex" className='controller' top="Создание новой категории" >
          
          <Controller
            name="sex"
            control={control}
            defaultValue='male'
            rules={{required: true}}
            render={ ({field}) => {
              return <Select
                id="sex"
                placeholder="Пол"
                value={field.value}
                onChange={field.onChange}
                options={[
                  { label: 'Мужской', value: 'male' },
                  { label: 'Женский', value: 'female' },
                ]}
              />
            }}
          />
            

        </FormItem>
        
        <FormItem htmlFor="directoryName" className='controller' top="Название директории" >
            <Controller defaultValue="" name="name" rules={{required: true}} control={control} render={({field}) =>  <Input value={field.value} onChange={field.onChange} id="directoryName"/>}/>
        </FormItem>

        <FormItem htmlFor="directoryPath" className='controller' top="Путь до директории" >
            <Controller defaultValue="" name="path" rules={{required: true}} control={control} render={({field}) => <Input value={field.value} onChange={field.onChange} id="directoryPath" />}/>
        </FormItem>

        <Button type="submit" className='controller' size='l'>Создать</Button>
        
      </form>
    </Group>
}