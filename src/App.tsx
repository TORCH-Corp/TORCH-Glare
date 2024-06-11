import { TableCell } from '../dist'
import './lib/styles/colors/colorMapping/dark.css'

function App() {

  return (
    <section className='app' >
      <TableCell
        data-testid='test'
        component_size={'S'}
        name={'dasd'}
        cellLabel={'asdas'}
        component_type={'Label-Buttons'}
      />
    </section >
  )
}
export default App

