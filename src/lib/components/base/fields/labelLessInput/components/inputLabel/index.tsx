import './style.scss';

interface Props {
    active: boolean;
    label: string;
    component_size?: "S" | "M" | "L";
    required?: boolean;
    name?: string;
}

export function InputLabel({ active, label, component_size, required, name }: Props) {
    return (
        <section className={`glare-InputLabel-wrapper glare-InputLabel-size-${component_size || "S"}`}>
            <section className='glare-InputLabel-label-wrapper'>
                {/* active is when the input is focused we will change the label font size */}
                <label className={active ? "glare-InputLabel-active" : ""} htmlFor={name}>
                    {label}
                </label>
                {/* this is the required symbol and it will be shown only if required is true */}
                {required && <p>*</p>}
            </section>
            <span className='glare-InputLabel-divider'></span>
        </section>
    );
}
