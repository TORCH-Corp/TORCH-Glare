import { InputHTMLAttributes } from 'react';
import './style.scss'
import Button from '../../buttons/button';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    getRootProps: () => any
    getInputProps: () => any
    isDropAreaActive: boolean
    mainLabel: string
    secondaryLabel: string
}
export function AttachmentField({ getInputProps, getRootProps, isDropAreaActive, mainLabel, secondaryLabel, ...props }: Props) {
    return (
        <Button component_style="PrimeContStyle"  {...getRootProps()} className={'glare-attachment-drop-zone' + (isDropAreaActive ? ' drop-area-active' : '')}>
            <h1 className='glare-attachment-field-main-label'>{mainLabel}</h1>
            <p className='glare-attachment-field-label'>{secondaryLabel}</p>
            <input  {...props} {...getInputProps()} type="file" hidden />
        </Button>
    )
}
