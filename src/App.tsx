import { AuthButton, DropDownMenu, DropDownMenuItem, InputField } from "./lib"

function App() {

  return (
    <section className='app' >
      {/* Email Field */}


      {/* Password Field */}
      {/*    <InputField
        label="Label" name={""}
        error_message="werweeewrerwe"
        component_size="M"
        drop_down_list_child={
          <DropDownMenu component_style='Presentation-Style'>
            <DropDownMenuItem component_label={"Label"} element_name={"dsa"} component_style='System-Style' onClick={() => console.log("click")} />
            <DropDownMenuItem component_label={"Label"} element_name={"dsa"} component_style='System-Style' />
            <DropDownMenuItem component_label={"Label"} element_name={"dsa"} />
          </DropDownMenu>
        }
      /> */}
      <AuthButton type="submit" >Label</AuthButton>
    </section >
  )
}
export default App

