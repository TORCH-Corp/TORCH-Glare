import { DropDownMenu, DropDownMenuItem } from './lib'
import { ProfileItem } from '../dist/'
import './lib/styles/colors/colorMapping/dark.css'

function App() {

  return (
    <section className='app' >
      <ProfileItem Label={'Adem Daniel'} user_avatar={''} drop_down_list_child={
        <DropDownMenu component_style='System-Style'>
          <DropDownMenuItem component_style='System-Style' component_label={'Edit Profile'} element_name={'profile'} />
          <DropDownMenuItem component_style='System-Style' component_label={'Logout'} element_name={'logout'} />
        </DropDownMenu>
      } />
    </section >
  )
}
export default App

