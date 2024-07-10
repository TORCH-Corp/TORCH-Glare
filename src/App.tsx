import { DropDownMenu, DropDownMenuItem, InputField } from './lib'
import './lib/styles/colors/colorMapping/dark.css'

function App() {

  return (
    <section className='app' >
      <InputField name={''} error_message='fsfds'

        drop_down_list_child={
          <DropDownMenu>
            <DropDownMenuItem component_label={'sss'} element_name={''} />
          </DropDownMenu>
        }
      />
    </section >
  )
}
export default App

