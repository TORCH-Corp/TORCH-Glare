import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/utils';


interface Props extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    selectedImg: any
    onExpand?: () => void
    expandLabel?: string
    hasExpand?: boolean
    theme?: "dark" | "light" | "default"
}

export const PicContainer = forwardRef<HTMLInputElement, Props>(({ theme, id, selectedImg, onExpand, expandLabel, hasExpand, ...props }, ref) => {
    return (
        <section data-theme={theme} className={cn("flex items-center justify-center w-[65px] h-[65px] rounded-md relative overflow-hidden border-none  group", props.className)}>
            <input
                {...props}
                ref={ref}
                hidden
                id={id}
                type='file'
            />
            {selectedImg ? <UploadedImg imageSrc={selectedImg} /> : <BaseComponent label="Upload Image" id={id} />}
            {hasExpand ? selectedImg && <ExpandImage onExpand={onExpand} expandLabel={expandLabel} /> : null}
        </section>
    );
})
PicContainer.displayName = 'PicContainer';





function BaseComponent({ id, label }: any) {
    return (
        <label htmlFor={id} className={cn([
            'w-full h-full gap-[2px] flex flex-col justify-center items-center px-1',
            ' rounded-lg border-2 border-dashed',
            ' border-[--border-presentation-badge-blue-purple]',
            ' bg-[--background-presentation-badge-blue-purple]',
            ' transition-all duration-300 ease-in-out',
            ' hover:bg-[--background-presentation-badge-gray] hover:border-[--border-presentation-badge-gray]']
        )}>
            <i className="ri-attachment-line text-[--content-presentation-badge-blue-purple] group-hover:text-[#797C7F] text-[24px] h-[24px]"></i>
            <p className='text-[--content-presentation-badge-blue-purple] typography-labels-small-regular group-hover:text-[#797C7F] px-1 py-[2px] text-center'>{label}</p>
        </label>
    )
}
function ExpandImage({ onExpand, expandLabel = "Expand Pic" }: any) {
    return (
        <button onClick={onExpand} className='flex w-full h-full justify-center items-center flex-col absolute z-10 opacity-0 bg-black/50 transition-all duration-250 ease-in-out hover:opacity-100' >
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 3.5L17.8 5.8L14.91 8.67L16.33 10.09L19.2 7.2L21.5 9.5V3.5H15.5ZM3.5 9.5L5.8 7.2L8.67 10.09L10.09 8.67L7.2 5.8L9.5 3.5H3.5V9.5ZM9.5 21.5L7.2 19.2L10.09 16.33L8.67 14.91L5.8 17.8L3.5 15.5V21.5H9.5ZM21.5 15.5L19.2 17.8L16.33 14.91L14.91 16.33L17.8 19.2L15.5 21.5H21.5V15.5Z" fill="#F9F9F9" />
            </svg>
            <p className='text-[--content-presentation-action-hover] typography-labels-small-regular max-w-[50px] break-words m-0'>{expandLabel}</p>
        </button>
    )
}

function UploadedImg({ imageSrc }: any) {
    return (
        <section className='bg-white'>
            <img src={imageSrc} className='w-full h-full object-cover object-center' />
        </section>
    )
}

