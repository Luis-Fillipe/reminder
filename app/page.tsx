'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './components';
import moment from "moment"
import { useEffect, useState } from 'react';

const schema = z.object({
  title: z.string().min(3, 'Por favor, informe um titulo válido!'),
  date: z.coerce.date().refine((data) => data.getTime() >= new Date().setHours(0, 0, 0, 0), { message: "Por favor, selecione uma data de hoje em diante." })
});

type DataProps = z.infer<typeof schema>;

export function getStoredCartItems() {
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
  return {}; // Retorna um objeto vazio para o hashmap
}

export function setLocalStorage(key: string, value: unknown) {
  const data = JSON.stringify(value);
  window.localStorage.setItem(key, data);
}

export default function InputPage() {
  const [data, setData] = useState(getStoredCartItems());

  function handleSetLocalStorage(obj: { title: string, date: string }) {
    const storedData = getStoredCartItems();
    const updatedData = { ...storedData };

    if (obj.date in updatedData) {
      updatedData[obj.date].push({ title: obj.title });
    } else {
      updatedData[obj.date] = [{ title: obj.title }];
    }

    setLocalStorage('item_key', updatedData);
    setData(updatedData);
  }

  const { register, handleSubmit, formState: { errors } } = useForm<DataProps>({
    mode: 'onBlur',
    resolver: zodResolver(schema)
  });

  return (
    <>
      <h2>Lembretes</h2> 

      <form onSubmit={handleSubmit((data) => handleSetLocalStorage({ title: data.title, date: moment(data.date).add('days', 1).format('DD/MMM/YYYY') }))}>
        <Input
          {...register('title')}
          type="text"
          placeholder='Titulo do Lembrete:'
          label='Titulo:'
          helperText={errors.title?.message}
        />
        <Input
          {...register('date')}
          type="date"
          placeholder='Data do lembrete:'
          label='Data:'
          helperText={errors.date?.message}
        />
        <button type="submit">Enviar</button>
      </form>
      
      <div>
        {Object.keys(data).map(date => (
          <div key={date}>
            <h3>{date}</h3>
            {data[date].map((item: { title: string }, index: number) => (
              <div key={index}>{item.title}</div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
