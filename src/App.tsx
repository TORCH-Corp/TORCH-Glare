import 'torch-glare/dist/themes/colorMapping/dark.css';
import { Badge, DropDownMenu, FieldSection } from './lib';

function App() {

  return (
    <section className='app' >
      <FieldSection
        component_size="M"
        secondary_label=""
        label="Modules"
        required_label="Required"
        name={"modules"}
        readOnly

        badges_children={
          <>
            <Badge
              badge_style='badge-blue'
              badge_size='M'
              label={'e.namedddddddddddddddddddddddddd'}
              selected />
            <Badge
              badge_style='badge-blue'
              badge_size='M'
              label={'e.namedddddddddddddddddddddddddd'}
              selected />
            <Badge
              badge_style='badge-blue'
              badge_size='M'
              label={'e.namedddddddddddddddddddddddddd'}
              selected />
            <Badge
              badge_style='badge-blue'
              badge_size='M'
              label={'e.namedddddddddddddddddddddddddd'}
              selected />
            <Badge
              badge_style='badge-blue'
              badge_size='M'
              label={'e.namedddddddddddddddddddddddddd'}
              selected />
          </>
        }

        drop_down_list_child={
          <DropDownMenu component_style='System-Style'>
            <Badge
              badge_style='badge-blue'
              badge_size='M'
              label={'e.namdddddddddddddddddddddddde'}
            />

          </DropDownMenu>
        }
      />
    </section >
  )
}
export default App

