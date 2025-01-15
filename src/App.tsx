
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/base/dropDowns/dropdownMenu_v2";
import { DropdownMenuItem } from "@/components/base/dropDowns/dropDownMenuItem_v2";

function App() {
  return (

    <div className="flex flex-col gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger >
          OPEN
        </DropdownMenuTrigger>
        <DropdownMenuContent>

        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
export default App; 
