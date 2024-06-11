import './style.scss';

interface Props {
    active: boolean;
    label: string;
    component_size?: "S" | "M" | "L";
    required?: boolean;
    name?: string;
}

export function InputLabel({ active, label, component_size = "S", required, name }: Props) {
    return (
        <section className={`glare-InputLabel-wrapper glare-InputLabel-size-${component_size}`}>
            <section className='glare-InputLabel-label-wrapper'>
                <label className={active ? "glare-InputLabel-active" : ""} htmlFor={name}>
                    {label}
                </label>
                {required && <p>*</p>}
            </section>
            <span className='glare-InputLabel-divider'></span>
        </section>
    );
}
