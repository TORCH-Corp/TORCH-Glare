import { TooltipProvider } from "@radix-ui/react-tooltip";
import Tooltip, { ContentSide, TooltipType } from "./lib/components/base/tooltips/tooltip_v2";

function App() {
  return (

    <TooltipProvider>
      <Tooltip open text="hello" disabled={true} contentSide={ContentSide.LEFT} type={TooltipType.PRIMARY} size="small" tip={true}>
        <button>open</button>
      </Tooltip>
    </TooltipProvider>
  );
}

export default App;
