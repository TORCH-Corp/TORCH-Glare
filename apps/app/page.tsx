'use client';
import { Form, FormField } from '@/components/Form';
import { FormControl, FormDescription, FormLabel, FormMessage } from '@/components/Form';
import { FormItem } from '@/components/Form';
import { useForm } from 'react-hook-form';
import { InputField } from '@/components/InputField';
import Examples from '../exmples';

export default function page() {

  const form = useForm({
    defaultValues: {
      username: '',
    },
  });

  const handleSubmit = (data: any) => {
    console.log(data);
  }
  return (
    <div className='w-full '>
      {/*    <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel />
                <FormControl>
                  <InputField {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <button type='submit'>Submit</button>
        </form>
      </Form> */}

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