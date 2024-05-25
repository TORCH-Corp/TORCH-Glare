import './style.scss'


interface Props {
    active: boolean
    label: string
    component_size?: "S" | "M" | "L"
    required?: boolean
    name?: string
}
export function InputLabel(props: Props) {


    return (
        <section className={`glare-InputLabel-wrapper glare-InputLabel-size-${props.component_size ? props.component_size : "S"}`} >
            <section className='glare-InputLabel-label-wrapper'>
                <label className={props.active ? "glare-InputLabel-active" : ""} htmlFor={props.name}>
                    {props.label}
                </label>
                {props.required && <p>*</p>}
            </section>
            <span className='glare-InputLabel-divider'></span>
        </section>
    )
}
