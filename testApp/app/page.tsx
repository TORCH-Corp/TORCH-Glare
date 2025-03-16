'use client';
import Examples from '../exmples';

export default function page() {

  return (
    <Examples />
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