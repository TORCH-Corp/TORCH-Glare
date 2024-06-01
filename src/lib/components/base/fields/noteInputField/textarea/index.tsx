import { forwardRef, TextareaHTMLAttributes, Ref } from 'react';
import './style.scss';
import Tooltip from '../../../tooltips/tooltip';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    name: string;
    negative?: boolean;
    error_message?: string;
}

export const Textarea = forwardRef((props: Props, ref: Ref<HTMLTextAreaElement>) => {
    return (
        <section className='glare-textarea-wrapper'>
            <textarea
                {...props}
                className={`glare-textarea ${props.negative || props.error_message ? "glare-textarea-negative" : ""} ${props.className}`}
                name={props.name}
                ref={ref} // Forward the ref
            />
            <Tooltip message={props.error_message || ""} isActive={props.error_message !== undefined} />
        </section>
    );
});

