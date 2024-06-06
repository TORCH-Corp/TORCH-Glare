import { DropDownMenu, DropDownMenuItem, InputField, LabelLessInput } from "./lib"

function App() {

  return (
    <section className='app' >
      {/* Email Field */}


      {/* Password Field */}
      <InputField
        label="Label" name={""}
        component_size="M"
        drop_down_list_child={
          <DropDownMenu component_style='Presentation-Style'>
            <DropDownMenuItem component_label={"Label"} element_name={"dsa"} component_style='System-Style' onClick={() => console.log("click")} />
            <DropDownMenuItem component_label={"Label"} element_name={"dsa"} component_style='System-Style' />
            <DropDownMenuItem component_label={"Label"} element_name={"dsa"} />
          </DropDownMenu>
        }
      />
      <button type="submit" >Submit</button>
    </section >
  )
}
export default App

