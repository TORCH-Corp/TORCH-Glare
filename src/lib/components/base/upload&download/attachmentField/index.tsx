import { InputHTMLAttributes } from 'react';
import './style.scss'
import Button from '@/components/base/buttons/button';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    getRootProps: () => any
    getInputProps: () => any
    isDropAreaActive: boolean
    mainLabel: string
    secondaryLabel: string
}
export function AttachmentField({ getInputProps, getRootProps, isDropAreaActive, mainLabel, secondaryLabel, ...props }: Props) {
    return (
        <Button style={{ ...props.style }} component_style="PrimeContStyle"  {...getRootProps()} className={`glare-attachment-drop-zone ${props.className}` + (isDropAreaActive ? ' drop-area-active' : '')}>
            <h1 className='glare-attachment-field-main-label'>{mainLabel}</h1>
            <p className='glare-attachment-field-label'>{secondaryLabel}</p>
            <input  {...props} style={{}} {...getInputProps()} type="file" hidden />
        </Button>
    )
}
