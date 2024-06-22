import 'torch-glare/dist/themes/colorMapping/default.css';
import { FieldSection } from './lib/components/shared';

function App() {

  return (
    <section className='app' >
      <FieldSection
        name={'ss'}
        label={'Label'}
        component_size='M'
        required_label='Required'
      />
    </section >
  )
}
export default App

