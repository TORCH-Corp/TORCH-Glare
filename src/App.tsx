import { StepperTab } from './lib'
import { StepperPhoneArrow } from './lib/components/base/steppers/StepperPhoneArrow'
import './lib/styles/colors/colorMapping/dark.css'

function App() {

  return (
    <section className='app' >
      <StepperTab forward={() => { console.log('forward') }} backward={() => { console.log('backward') }} stepper_label={'step one'} stepper_counter={0} is_the_first />
      <StepperPhoneArrow />
      <StepperPhoneArrow reverse_icon disabled />
    </section >
  )
}
export default App

