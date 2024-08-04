import './style.scss'

interface Props {
    imageSrc: string
}
export function UploadedImg(props: Props) {
    return (
        <section className='glare-attachment-pic-wrapper'>
            <img src={props.imageSrc} className='glare-attachment-pic' />
        </section>
    )
}


