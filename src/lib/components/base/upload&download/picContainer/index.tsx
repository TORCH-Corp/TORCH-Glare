import { InputHTMLAttributes, forwardRef } from 'react';
import './style.scss';
import { BaseComponent } from './components/baseComponent';
import { UploadedImg } from './components/uploadedImg';
import { ExpandImage } from './components/expandImage';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    selectedImg: string
    ExpandImageClick?: () => void
}

export const PicContainer = forwardRef<HTMLInputElement, Props>(({ id, selectedImg, ExpandImageClick, ...props }, ref) => {
    return (
        <section className="glare-pic-container">
            <input
                {...props}
                ref={ref}
                hidden
                id={id}
                type='file'
                className='glare-attachment-pic'
            />
            {selectedImg ? <UploadedImg imageSrc={selectedImg} /> : <BaseComponent id={id} label="Upload Pic" />}
            {selectedImg && <ExpandImage ExpandImageClick={ExpandImageClick} src={selectedImg} />}
        </section>
    );
});

PicContainer.displayName = 'PicContainer';
