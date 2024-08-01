import { ButtonHTMLAttributes } from 'react'
import './style.scss'
import { SwitcherLabelSlider } from './switcherLabelSlider'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    active: boolean
    active_label?: string
    disabled_label?: string
}

export function Switcher({
    active = false,
    active_label,
    disabled_label,
    ...props
}: Props) {
    return (
        <section className='glare-switcher-wrapper'>
            <button {...props} className={`glare-switcher ${active ? 'glare-switcher-active' : ""} ${props.className ? props.className : ""}`}>
                <div className="switcher-indicator"></div>
            </button>
            {active_label && <SwitcherLabelSlider disabled_label={disabled_label} active={active} active_label={active_label} />}
        </section>

    )
}
