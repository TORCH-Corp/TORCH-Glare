'use client'
import { Button } from '@/components/Button';
import { DatePicker } from '@/components/DatePicker';
import { SlideDatePicker } from '@/components/SlideDatePicker';
import { Controller, useForm } from 'react-hook-form';

export default function Page() {
  const { control, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 w-full p-5'>
      <Controller
        name="slideDatePicker"
        control={control}
        render={({ field }) => (
          <SlideDatePicker {...field} />
        )}
      />

      {/*       <Controller
        name="DatePicker"
        control={control}
        render={({ field }) => (
          <DatePicker timePicker {...field} />
        )}
      /> */}

      <Button theme='light' type='submit'>Submit</Button>
    </form>
  );
}




