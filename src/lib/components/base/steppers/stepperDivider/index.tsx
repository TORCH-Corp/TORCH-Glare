import './style.scss'

interface Props extends React.HTMLAttributes<HTMLDivElement> {

}
export function StepperDivider({ ...props }: Props) {
    return (
        <div {...props} className={`stepper-tab-divider ${props.className}`}>
            <div className="stepper-tab-divider-wrapper">
                <div className="stepper-tab-start-line"></div>
                <div className="stepper-tab-start-line"></div>
            </div>
        </div>
    )
}
