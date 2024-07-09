import { StepperTab } from './lib'
import { StepperDivider } from './lib/components/base/steppers/stepperDivider'
import './lib/styles/colors/colorMapping/dark.css'

function App() {

  return (
    <section className='app' >
      <StepperDivider />
      <StepperTab stepper_label={'step one'} stepper_counter={0} />
      <StepperDivider />
    </section >
  )
}
export default App

