'use client'
import { Datepicker } from '@/components/DatePicker';
import { InputField } from '@/components/InputField';
import { IosDatePicker } from '@/components/IosDatePicker-dev';

export default function page() {
  return (
    <div className='w-full h-full'>
      <div className=' flex justify-center items-center p-40'>
        <Datepicker
          customInput={<InputField />}
          onChange={(date: Date) => {
            console.log(date)
          }}
        />
      </div>
    </div>
  );
};

