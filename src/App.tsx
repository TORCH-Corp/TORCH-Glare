import { InputField } from 'torch-glare'
import 'torch-glare/dist/themes/colorMapping/light.css';

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

