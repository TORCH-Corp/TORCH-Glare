import { Codeblock } from '@/components/CodeBlock'
import TabFormItem from '@/components/TabFormItem'
import { cn } from '@/utils/cn'
import { HTMLAttributes, ReactNode, useState } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
    code: string
    previewComponent: ReactNode | any
    header: ReactNode
}

export const CodeBlockAndPreview = ({ previewComponent, header, code, ...props }: Props) => {

    const [preview, setPreview] = useState(true)
    return (
        <div {...props} className={cn("flex flex-col w-full flex-1 gap-[16px] overflow-hidden")}>

            <div className='flex w-full justify-between items-center border-b border-border-presentation-global-primary p-2'>
                <p className='text-content-presentation-global-secondary  typography-headers-large-medium whitespace-nowrap'>{header}</p>

                <div className='flex justify-between items-center gap-2 flex-nowrap'>
                    <div className='bg-border-presentation-global-primary h-[28px] w-[1px] rounded-sm' />
                    <TabFormItem componentType='top' active={preview && true} onClick={() => setPreview(true)} >Preview</TabFormItem>
                    <TabFormItem componentType='top' active={preview && false} onClick={() => setPreview(false)} >Code</TabFormItem>
                </div>
            </div>
            {
                preview ?
                    <div className={cn('bg-background-presentation-form-field-primary w-full flex-1  flex justify-center items-center rounded-[6px] p-[16px] min-h-[230px] gap-2 overflow-auto', props.className)}>
                        {previewComponent}
                    </div> :
                    <Codeblock
                        code={code}
                    />
            }

        </div>
    )
}
