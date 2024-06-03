import { InputField, LabelLessInput } from "./lib"

/* interface FormData {
  email: string;
  password: string;
} */

function App() {

  /* const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    console.log(data.email, data.password);
  };
 */
  return (
    <section className='app' >
      <form action="" >
        {/* Email Field */}
        <LabelLessInput
          label={"Label"} name={""}
        />

        {/* Password Field */}
        <InputField
          label="Label" name={""}
          component_size="M"
        />
        <button type="submit" >Submit</button>
      </form>
    </section >
  )
}
export default App

