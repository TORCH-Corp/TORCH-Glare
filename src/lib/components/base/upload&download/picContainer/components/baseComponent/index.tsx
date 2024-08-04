import './style.scss'
interface Props {
    id: string
    label: string
}
export function BaseComponent(props: Props) {
    return (
        <label htmlFor={props.id} className='glare-pic-container-upload-wrapper'>
            <i className="ri-attachment-line"></i>
            <p className='glare-pic-container-upload-label'>{props.label}</p>
        </label>
    )
}
