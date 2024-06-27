import React, { ButtonHTMLAttributes, ReactNode, useRef } from 'react';
import { useHideDropDown } from "../../../base/fields/hooks/usehideDropDown";
import { DynamicContainer } from "../../../helpers";
import './style.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    Label: string; // label of the button
    user_avatar: string; // user avatar img
    drop_down_list_child?: ReactNode;  // drop down list child component
}

const ProfileItem: React.FC<Props> = ({ Label, user_avatar, drop_down_list_child, onClick, ...buttonProps }) => {
    const itemRef = useRef<HTMLButtonElement>(null);
    // this hook will show or hide the drop down list when you click on the avatar
    const { isActive, setIsActive } = useHideDropDown(itemRef);

    return (
        <section className="profile-item-wrapper" ref={itemRef}>
            <button
                {...buttonProps}
                className="profile-item"
                onClick={(e) => {
                    setIsActive(true); // for dropdown list show or hide when user click on the component
                    if (onClick) onClick(e);
                }}
            >
                <section className="profile-item-label-img-wrapper">
                    <div className="purple-line"></div>
                    <section className="profile-item-label-img">
                        <img src={user_avatar} alt="avatar" className="profile-item-icon" />
                        <p>{Label}</p>
                    </section>
                </section>
                <i className="ri-arrow-down-s-line"></i>
            </button>

            {/* // if drop_down_list_child is not null then show the dropdown list
                // the dynamic container component is used to show the dropdown list and detect hit the viewport and change it's direction
             */}
            {drop_down_list_child && (
                <DynamicContainer onClick={() => setIsActive(false)} active={isActive}>
                    {drop_down_list_child}
                </DynamicContainer>
            )}
        </section>
    );
};

export default ProfileItem;
