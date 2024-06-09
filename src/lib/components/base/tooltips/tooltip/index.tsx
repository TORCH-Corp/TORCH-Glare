import { HTMLAttributes, useRef } from "react"
import RectangleIcon from "./rectangleIcon"
import './style.scss'
import UseDirectionCalc from "../../../../hooks/useDirectionCalc"


interface Props extends HTMLAttributes<HTMLDivElement> {
    message: string | null
}

const Tooltip = (props: Props) => {

    const ref = useRef<any>(null)
    const dir = UseDirectionCalc({
        ElementRef: ref,
        dirClasses: {
            left: "Tooltip-Left",
            right: "Tooltip-Right",
            top: "Tooltip-TOP",
            bottom: "Tooltip-BOTTOM "
        },
        isElementActive: props.message ? true : false,
        trigger: { ...props }
    })

    return (
        props.message ?
            <section
                {...props}
                ref={ref}
                className={`Tooltip ${dir} ${props.className}`}>
                <RectangleIcon />
                <p>{props.message}</p>
            </section>
            :
            null
    )
}

export default Tooltip
