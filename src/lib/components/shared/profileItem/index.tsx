import { ReactNode, useRef } from "react"
import { useHideDropDown } from "../../base/fields/hooks/usehideDropDown"
import { Button } from "../../base/main"
import './style.scss'
import { DynamicContainer } from "../../helpers"


interface Props {
    Label: string
    user_avatar: string
    drop_down_list_child?: ReactNode
}

export const ProfileItem = (props: Props) => {
    const itemRef = useRef(null)
    const { isActive, setIsActive } = useHideDropDown(itemRef)
    return (
        <section className="profile-item-wrapper" ref={itemRef}>
            <Button
                className="profile-item"
                left_icon={<i className="ri-arrow-down-s-line"></i>}
                component_size='M'
                onClick={() => setIsActive(true)}
            >
                <section className="profile-item-label-img-wrapper">
                    <div className="purple-line"></div>
                    <section className="profile-item-label-img">
                        <img src={props.user_avatar} alt="avatar" className="profile-item-icon" />
                        <p>{props.Label}</p>
                    </section>
                </section>
            </Button>


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
