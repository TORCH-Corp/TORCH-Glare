import { Codeblock } from './CodeBlock'
import TabFormItem from './TabFormItem'
import { cn } from '../utils/cn'
import { HTMLAttributes, ReactNode, useState } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
    code: string
    previewComponent: ReactNode
    header: ReactNode
}

export const CodeBlockAndPreview = (props: Props) => {

    const [preview, setPreview] = useState(true)
    return (
        <div {...props} className={cn("flex flex-col w-full gap-[16px]")}>

            <div className='flex w-full justify-between items-center border-b border-border-presentation-global-primary p-2'>
                <p className='text-content-presentation-global-secondary  typography-headers-large-medium'>{props.header}</p>

                <div className='flex justify-between items-center flex-wrap gap-2'>
                    <div className='bg-border-presentation-global-primary h-[28px] w-[1px] rounded-sm' />
                    <TabFormItem componentType='top' active={preview && true} onClick={() => setPreview(true)} >Preview</TabFormItem>
                    <TabFormItem componentType='top' active={preview && false} onClick={() => setPreview(false)} >Code</TabFormItem>
                </div>
            </div>
            {
                preview ?
                    <div className='bg-background-presentation-form-field-primary w-full flex justify-center items-center rounded-[6px] p-[16px] min-h-[230px] gap-2'>
                        {props.previewComponent}
                    </div> :
                    <Codeblock
                        code={props.code}
                    />
            }

        </div>
    )
}
