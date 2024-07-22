import { Datepicker } from './lib'
import './lib/styles/colors/colorMapping/dark.css'

function App() {

  return (
    <section className='app' >
      <Datepicker
        component_style='system'
        component_size="M"
        placeholder="Select date"
        name="example-datepicker"
      />
    </section >
  )
}
export default App

