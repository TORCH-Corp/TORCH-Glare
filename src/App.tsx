import { InputField, LabelLessInput } from "./lib"
import { useForm, SubmitHandler } from 'react-hook-form';

interface FormData {
  email: string;
  password: string;
}

function App() {

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    console.log(data.email, data.password);
  };

  return (
    <section className='app' >
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        {/* Email Field */}
        <LabelLessInput
          label={"Label"} {...register('email')} />

        {/* Password Field */}
        <InputField
          label="Label"
          {...register('password')}
        />

        <button type="submit" >Submit</button>
      </form>
    </section >
  )
}
export default App

