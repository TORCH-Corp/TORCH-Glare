import { ButtonHTMLAttributes, ReactNode, useRef } from "react"
import { useHideDropDown } from "../../../base/fields/hooks/usehideDropDown"
import { DynamicContainer } from "../../../helpers"
import './style.scss'


interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    Label: string
    user_avatar: string
    drop_down_list_child?: ReactNode
}

export const ProfileItem = (props: Props) => {
    const itemRef = useRef(null)
    const { isActive, setIsActive } = useHideDropDown(itemRef)

    return (
        <section className="profile-item-wrapper" ref={itemRef}>
            <button
                {...props}
                className="profile-item"
                onClick={(e) => {
                    setIsActive(true)
                    props.onClick && props.onClick(e)
                }}
            >
                <section className="profile-item-label-img-wrapper">
                    <div className="purple-line"></div>
                    <section className="profile-item-label-img">
                        <img src={props.user_avatar} alt="avatar" className="profile-item-icon" />
                        <p>{props.Label}</p>
                    </section>
                </section>

                <i className="ri-arrow-down-s-line"></i>
            </button>


            {
                props.drop_down_list_child ?
                    <DynamicContainer onClick={() => setIsActive(false)} active={isActive}>
                        {props.drop_down_list_child}
                    </DynamicContainer>
                    :
                    null
            }
        </section>

    )
}
