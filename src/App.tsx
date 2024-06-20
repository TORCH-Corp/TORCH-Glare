import { InputField } from '../dist/'
import 'torch-glare/dist/themes/colorMapping/dark.css';

function App() {

  return (
    <section className='app' >
      <InputField
        name={'ss'}
        label={'Label'}
        secondary_label='Label'
      />
    </section >
  )
}
export default App

