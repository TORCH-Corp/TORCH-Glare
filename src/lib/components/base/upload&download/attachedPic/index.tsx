import { HTMLAttributes } from "react";
import { Button } from "@components/base/buttons/button";
import "./style.scss";

interface Props extends HTMLAttributes<HTMLDivElement> {
  src: string;
  headerLabel: string;
  closeButtonClick: () => void;
  changeButtonClick: () => void;
  deleteButtonClick: () => void;
  deleteLabel: string;
  changeLabel: string;
}

export function AttachedPic({
  src,
  closeButtonClick,
  changeButtonClick,
  deleteButtonClick,
  deleteLabel,
  changeLabel,
  headerLabel,
  ...props
}: Props) {
  return (
    <section
      {...props}
      className={"glare-attached-pic-wrapper" + " " + props.className}
    >
      <section className="glare-attached-pic-header">
        <p className="glare-attached-pic-label">{headerLabel}</p>
        <Button onClick={closeButtonClick} size="M" buttonType="icon">
          <i className="ri-close-line"></i>
        </Button>
      </section>

      <img className="glare-attached-pic" src={src} />

      <section className="glare-attached-pic-footer">
        <Button size="M" onClick={deleteButtonClick} variant="RedContStyle">
          {deleteLabel}
        </Button>
        <Button size="M" variant="BlueContStyle" onClick={changeButtonClick}>
          {changeLabel}
        </Button>
      </section>
    </section>
  );
}
