import { ContentColumn } from './lib/components/shared'
import './lib/styles/colors/colorMapping/light.css'

function App() {

  return (
    <section className='app' >
      <ContentColumn
        component_label='Label'
        component_subLabel='Label'
        warning_label='label'
        error_label='Label'
      />
    </section >
  )
}
export default App

