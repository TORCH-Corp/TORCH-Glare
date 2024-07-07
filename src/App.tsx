import { StepperTab } from './lib'
import './lib/styles/colors/colorMapping/dark.css'

function App() {

  return (
    <section className='app' >
      <StepperTab forward={() => { console.log('forward') }} backward={() => { console.log('backward') }} stepper_label={'step one'} is_selected stepper_counter={0} with_start_flag={true} />
    </section >
  )
}
export default App

