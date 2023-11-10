'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './components';
import moment from "moment";
import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

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
  const [data, setData] = useState({});

  useEffect(() => {
    const storedData = getStoredCartItems();
    setData(storedData);
  }, []);

  function adjustDate(date) {
    return moment(date).add(1, 'day').format('DD/MMM/YYYY');
  }

  function handleSetLocalStorage(obj) {
    const updatedData = { ...data };

    const adjustedDate = adjustDate(obj.date);

    if (adjustedDate in updatedData) {
      updatedData[adjustedDate].push({ title: obj.title });
    } else {
      updatedData[adjustedDate] = [{ title: obj.title }];
    }

    setLocalStorage('item_key', updatedData);
    setData(updatedData);
  }

  const { register, handleSubmit, formState: { errors } } = useForm<DataProps>({
    mode: 'onBlur',
    resolver: zodResolver(schema)
  });

  function removeFromLocalStorage(date, title) {
    const updatedData = { ...data };
    const formattedDate = moment(date).format('DD/MMM/YYYY'); // Ajuste a data para o formato desejado, se necessário

    if (formattedDate in updatedData) {
      updatedData[formattedDate] = updatedData[formattedDate].filter(item => item.title !== title);
      setLocalStorage('item_key', updatedData);
      setData(updatedData);
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Cadastro de Lembretes</h2>

      <form onSubmit={handleSubmit((data) => handleSetLocalStorage({ title: data.title, date: data.date }))} className="mb-4">
        <Input
          {...register('title')}
          type="text"
          placeholder='Titulo do Lembrete:'
          label='Titulo:'
          helperText={errors.title?.message}
          className="mr-2"
        />
        <Input
          {...register('date')}
          type="date"
          placeholder='Data do lembrete:'
          label='Data:'
          helperText={errors.date?.message}
          className="mr-2"
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Criar
        </button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <h2 className="text-2xl mb-4">Lembretes</h2>
        <div>
          {Object.keys(data).map(date => (
            <div key={date}>
              {data[date].length > 0 && <h3>{date}</h3>}
              {data[date].map((item: { title: string }, index: number) => (
                <div key={index} className="flex items-center mb-2">
                  <span>{item.title}</span>
                  <AiOutlineClose onClick={() => removeFromLocalStorage(date, item.title)} className="ml-2" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
