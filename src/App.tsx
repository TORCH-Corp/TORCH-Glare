import { ProfileItem } from '@/components/ProfileItem';
import Examples from './exmples';

function App() {



  return (
    <Examples />
  );
}
export default App;


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