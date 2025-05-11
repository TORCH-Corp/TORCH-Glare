'use client'
import { Button } from '@/components/Button';
import { Controller, useForm } from 'react-hook-form';
import { BadgeField } from '@/components/BadgeField';
import { Tag } from '@/hooks/useTagSelection';
import { DatePicker } from '@/components/DatePicker';
import { SlideDatePicker } from '@/components/SlideDatePicker';
import { InputField } from '@/components/InputField';
import { PopoverItem } from '@/components/Popover';
export default function Page() {
  const { control, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
  }
  const tags: Tag[] = [
    { id: '1', name: 'Electronics', isSelected: false, variant: 'blue' },
    { id: '2', name: 'Books', isSelected: false, variant: 'green' },
    { id: '3', name: 'Clothing', isSelected: false, variant: 'purple' },
    { id: '4', name: 'Home', isSelected: false, variant: 'yellow' },
    { id: '5', name: 'Sports', isSelected: false, variant: 'navy' },
    { id: '8', name: 'Limited Edition', isSelected: false, variant: 'cocktailGreen' },
  ]
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 w-full p-5'>
      <Controller
        name="slideDatePicker"
        control={control}
        render={({ field }) => (
          <DatePicker
            {...field}
          />
        )}
      />

      <Controller
        name="slideDatePicker"
        control={control}
        render={({ field }) => (
          <SlideDatePicker
            {...field}
          />
        )}
      />

      <Controller
        name="slideDatePicker"
        control={control}
        render={({ field }) => (
          <InputField
            {...field}
            popoverChildren={
              tags.map((tag) => (
                <PopoverItem
                  key={tag.id}
                  onClick={() => {
                    console.log(tag);
                  }}
                >
                  {tag.name}
                </PopoverItem>
              ))
            }
          />
        )}
      />

      <Button theme='light' type='submit'>Submit</Button>
    </form>
  );
}




