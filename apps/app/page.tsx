'use client'
import { Button } from '@/components/Button';
import { Controller, useForm } from 'react-hook-form';
import { BadgeField } from '@/components/BadgeField';
import { Tag } from '@/hooks/useTagSelection';
import { DatePicker } from '@/components/DatePicker';
import { InputField } from '@/components/InputField';
import { CalendarIcon } from 'lucide-react';
import { PopoverItem } from '@/components/Popover';
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
          <InputField
            {...field}
            icon={<CalendarIcon />}
            popoverChildren={<PopoverItem>Hello</PopoverItem>}
          />
        )}
      />

      <Button theme='light' type='submit'>Submit</Button>
    </form>
  );
}




