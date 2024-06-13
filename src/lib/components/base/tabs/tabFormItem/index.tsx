import { ButtonHTMLAttributes } from "react";
import SideFormBarItem from "./components/sideFormBarItem";
import TopFormBarItem from "./components/topFormBar-Item";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    componentType: "Top" | "Side"
}

const TabFormItem: React.FC<Props> = ({
    componentType,
    ...props
}) => {
    return (
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
