import { TooltipProvider } from "@radix-ui/react-tooltip";
import Tooltip, { ContentSide, TooltipType } from "./lib/components/base/tooltips/tooltip_v2";

function App() {
  return (

    <TooltipProvider>
      <Tooltip text="hello" type={TooltipType.PRIMARY} >
        <input className="w-full border border-blue-500 p-2 rounded-md line-clamp-1 flex-1 overflow-hidden text-[#797C7F] text-xs font-normal leading-[147.5%]" />
      </Tooltip>
    </TooltipProvider>
  );
}

export default App;
