import { forwardRef, TextareaHTMLAttributes } from 'react';
import './style.scss';
import Tooltip from '@/components/base/tooltips/tooltip';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    name: string;
    negative?: boolean;
    error_message?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(({
    name,
    negative,
    error_message,
    ...props
}, ref) => {
    return (
        <section className='glare-textarea-wrapper'>
            <textarea
                {...props}
                className={`glare-textarea ${negative || error_message ? "glare-textarea-negative" : ""} ${props.className}`}
                name={name}
                ref={ref} // Forward the ref
            />

            {/* // show error message tooltip if error_message is passed */}
            <Tooltip message={error_message || ""} />
        </section>
    );
});
