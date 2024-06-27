import 'torch-glare/dist/themes/colorMapping/dark.css';
import { AuthButton, InputField } from './lib';

function App() {

  return (
    <section className='app' >
      <AuthButton>Label</AuthButton>
      <InputField name={''} error_message='error message' />
    </section >
  )
}
export default App

