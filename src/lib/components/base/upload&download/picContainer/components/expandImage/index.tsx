import './style.scss'

interface Props {
    src: string
    ExpandImageClick?: () => void
}
export function ExpandImage(props: Props) {

    return (
        <section className='glare-attachment-expand-wrapper' onClick={props.ExpandImageClick}>
            <ExpandIcon />
            <p className='expand-label'>Expand Pic</p>
        </section>
    )
}

function ExpandIcon() {
    return (
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 3.5L17.8 5.8L14.91 8.67L16.33 10.09L19.2 7.2L21.5 9.5V3.5H15.5ZM3.5 9.5L5.8 7.2L8.67 10.09L10.09 8.67L7.2 5.8L9.5 3.5H3.5V9.5ZM9.5 21.5L7.2 19.2L10.09 16.33L8.67 14.91L5.8 17.8L3.5 15.5V21.5H9.5ZM21.5 15.5L19.2 17.8L16.33 14.91L14.91 16.33L17.8 19.2L15.5 21.5H21.5V15.5Z" fill="#F9F9F9" />
        </svg>
    )
}