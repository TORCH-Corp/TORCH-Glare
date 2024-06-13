import { Button, InputField, TabFormItem } from './lib'
import './lib/styles/colors/colorMapping/default.css'

function App() {

  return (
    <section className='app' >
      <InputField
        component_size="M"
        label="User Name"
        placeholder="name@mail.com"
        left_side_icon={<i className="ri-account-circle-fill"></i>}
        theme="System-Style"
        name={''}
      />
      <TabFormItem componentType={'Side'} >Label</TabFormItem>

    </section >
  )
}
export default App

