'use client';
import Examples from '../exmples';
import StatusAlertDialogExample from '../exmples/StatusAlertDialogExample';

export default function page() {

  return (
    <div className='flex flex-col gap-2 w-full'>
      <Examples />
    </div>
  );
}


// using with react hook form lib
/*
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <SlideDatePicker
            {...field}
            onChange={(value) => field.onChange(value)}
          />
        )}
      />
      <button type="submit">Submit</button>
    </form>
*/