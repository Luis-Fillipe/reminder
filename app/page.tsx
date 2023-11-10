'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './components';
import { useState } from 'react';

const schema = z.object({
  title: z.string().min(3, 'Por favor, informe um titulo válido!'),
  //date: z.string().min(3, 'Por favor, informe uma data válida!'),
  date: z.coerce.date().refine((data) => data.getTime() >= new Date().setHours(-24,0,0,0), { message: "Por favor, selecione uma data de hoje em diante." })
});

type DataProps = z.infer<typeof schema>;

export function getLocalStorage(key: string){
  const data = window.localStorage.getItem(key);
  return JSON.parse(data!);
}

export function setLocalStorage(key: string, value: unknown){
  const data =JSON.stringify(value);
  return window.localStorage.setItem(key, data);
}

export default function InputPage() {
  const [data, setData] = useState();

  function handleGetLocalStorage(){
    const item = getLocalStorage('item_key');
    setData(item);
  }

  function getStoredCartItems() {
    if (typeof window !== "undefined") {
      const storedCartItems = localStorage.getItem("item_key");
      if (storedCartItems !== null) {
        try {
          const cartItems = JSON.parse(storedCartItems);
          return cartItems;
        } catch (error) {
          console.error(error);
        }
      }
    }
    return [];
  }
  
  function handleSetLocalStorage(obj: object){
    var data = getStoredCartItems();
    console.log('DENTRO DO SET ',data);
    data.push(obj);
    data.sort(function(a, b) {
      if(a.date < b.date) {
        return -1;
      } else {
        return true;
      }
    });
    setLocalStorage('item_key', data);
  }

  const { register, handleSubmit, formState: { errors } } = useForm<DataProps>({
    mode: 'onBlur',
    resolver: zodResolver(schema)
    
  });

  console.log(errors);

  return (
    <>
      <h2> Lembretes </h2>

      <form onSubmit={handleSubmit((data) => handleSetLocalStorage({title: data.title, date: data.date}))}>
        <Input {...register('title')} 
        type="text"
        placeholder='Titulo do Lembrete:' 
        label='Titulo:' 
        helperText = {errors.title?.message}
        />
        <Input {...register('date')} 
        type="date" 
        placeholder='Data do lembrete:' 
        label='Data:'
        helperText = {errors.date?.message}
         />
        <button type="submit">Enviar</button>
      </form>
    </>
  );
}