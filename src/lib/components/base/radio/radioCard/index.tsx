import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { Button } from '@/index';
import { RadioLabel } from '../radioLabel';
import './style.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    description_child?: ReactNode
    learn_more_label?: string
    learn_more_click_event?: () => void
    is_selected: boolean;
}

export const RadioCard = forwardRef<HTMLInputElement, Props>(({ label, description_child, learn_more_click_event, learn_more_label, is_selected, ...props }, ref) => {
    return (
        <section style={{ ...props.style }} className={`glare-radio-card ${props.disabled ? "glare-radio-card-disabled" : ""} ${props.className}`}>
            <section className='glare-radio-card-input-wrapper'>
                <RadioLabel {...props} style={{}} ref={ref} component_size={'S'} is_selected={is_selected} />
            </section>

            <h1 className='glare-radio-card-label'>{label}</h1>

            <section className='glare-radio-card-info'>
                <p className='glare-radio-card-info-description'>{description_child}</p>
                {learn_more_label && <Button onClick={() => learn_more_click_event && learn_more_click_event()} style={{ borderRadius: "11px" }} component_size='S' component_style="BlueSecStyle" right_icon={<i className="ri-information-line"></i>} >{learn_more_label}</Button>}
            </section>
        </section >
    )
});


