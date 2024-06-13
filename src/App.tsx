import { FieldSection } from './lib/components/shared'
import './lib/styles/colors/colorMapping/light.css'

function App() {

  return (
    <section className='app' >
      <FieldSection
        name={'ss'}
        label={'Label'}
        secondary_label='Label'
      />
    </section >
  )
}
export default App

