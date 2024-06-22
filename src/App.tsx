import 'torch-glare/dist/themes/colorMapping/default.css';
import { FieldSection } from './lib/components/shared';

function App() {

  return (
    <section className='app' >
      <FieldSection
        component_size="M"
        secondary_label="add your company name"
        label="Company Name"
        required_label="Required"
        name={"companyName"}
      />
    </section >
  )
}
export default App

