import './lib/styles/colors/colorMapping/dark.css'
import { StepperTab } from './lib/components/base/steppers/stepperTab';

function App() {

  return (
    <section className='app' >
      <StepperTab with_start_flag stepper_counter={0} stepper_label={'First Stepper First Stepper First Stepper'} />
    </section >
  )
}
export default App

