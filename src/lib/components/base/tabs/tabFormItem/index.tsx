import { ButtonHTMLAttributes } from "react";
import SideFormBarItem from "./components/sideFormBarItem";
import TopFormBarItem from "./components/topFormBar-Item";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    componentType: "Top" | "Side" // component type and style see on the figma design file
}

const TabFormItem: React.FC<Props> = ({
    componentType,
    ...props
}) => {
    return (
        // render the top or side form bar item based on the component type prop
        componentType === 'Top' ?
            <TopFormBarItem
                {...props}
            />
            :
            <SideFormBarItem
                {...props}
            />
    )
}

export default TabFormItem
