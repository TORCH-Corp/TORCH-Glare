'use client';
import { Icon, Input, InputGroup } from '@/components/InputGroup';
import Examples from '../exmples';
import { InputField } from '@/components/InputField';

export default function page() {

  return (
    <div className='flex justify-center items-center flex-col gap-2 w-full h-screen'>
      <Examples />
    </div>
  );
}


// using with react hook form lib
/*
     <InputGroup >
        <Icon>
          <i className="ri-mail-ai-line"></i>
        </Icon>
        <Input />
      </InputGroup>

      <InputField icon={<i className="ri-mail-ai-line"></i>} />
*/