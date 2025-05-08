'use client'
import { Button } from '@/components/Button';
import { DatePicker } from '@/components/DatePicker';
import { InnerLabelField } from '@/components/InnerLabelField';
import { Controller, useForm } from 'react-hook-form';

export default function Page() {
  const { control, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 w-full p-5'>
      <Controller
        name="dateOfBirth"
        control={control}
        render={({ field }) => (
          <DatePicker size='M' mode="range" timePicker={true} {...field} >
            <InnerLabelField label='Date of Birth' />
          </DatePicker>
        )}
      />

      <Button theme='light' type='submit'>Submit</Button>
    </form>
  );
}




