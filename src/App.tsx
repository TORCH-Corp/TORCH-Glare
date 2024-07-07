import { StepperTab } from './lib'
import './lib/styles/colors/colorMapping/light.css'

function App() {

  return (
    <section className='app' >
      <StepperTab forward={() => { console.log('forward') }} backward={() => { console.log('backward') }} stepper_label={'step one'} stepper_counter={0} is_the_first />
    </section >
  )
}
export default App

