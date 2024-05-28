import { Datepicker, DropDownButton, DropDownMenu } from "./lib/main"

function App() {

  return (
    <>
      <DropDownButton component_label={'Label'}
        drop_down_list_child={
          <DropDownMenu data-testid="dropdown">
            dropdown item
          </DropDownMenu>} />
    </>
  )
}

export default App
