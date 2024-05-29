import { ActionBarInputField, Datepicker, DropDownButton, DropDownMenu, DropDownMenuItem } from "./lib/main"

function App() {

  return (
    <ActionBarInputField drop_down_list_child={<DropDownMenu></DropDownMenu>} name={''} data-testid='test' />)
}

export default App
