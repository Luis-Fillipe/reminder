'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './components';

const schema = z.object({
  title: z.string().min(3, 'Por favor, informe um titulo válido!'),
  date: z.string().min(3, 'Por favor, informe uma data válida!')
});

type DataProps = z.infer<typeof schema>;



export default function InputPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<DataProps>({
    mode: 'onBlur',
    resolver: zodResolver(schema)
  });

  console.log(errors);

  return (
    <>
      <h2> Lembretes </h2>

      <form onSubmit={handleSubmit((data) => console.log(data))}>
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