import React, { ButtonHTMLAttributes, ReactNode, useRef } from 'react';
import { useHideDropDown } from "../../../base/fields/hooks/usehideDropDown";
import { DynamicContainer } from "../../../helpers";
import './style.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    Label: string;
    user_avatar: string;
    drop_down_list_child?: ReactNode;
}

const ProfileItem: React.FC<Props> = ({ Label, user_avatar, drop_down_list_child, onClick, ...buttonProps }) => {
    const itemRef = useRef<HTMLButtonElement>(null);
    const { isActive, setIsActive } = useHideDropDown(itemRef);

    return (
        <section className="profile-item-wrapper" ref={itemRef}>
            <button
                {...buttonProps}
                className="profile-item"
                onClick={(e) => {
                    setIsActive(true);
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

            {drop_down_list_child && (
                <DynamicContainer onClick={() => setIsActive(false)} active={isActive}>
                    {drop_down_list_child}
                </DynamicContainer>
            )}
        </section>
    );
};

export default ProfileItem;
