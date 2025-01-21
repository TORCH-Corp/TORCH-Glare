import { Button } from "@components/base/buttons/button";
interface Props {
  component_size?: "S" | "M" | "L"; // this props will change the button style size see on figma design file
  component_label: string;
  isActive: boolean; // this will show drop down list if you pass it
}

export function LabelAndButton(props: Props) {
  return (
    <section className="glare-drop-down-button-wrapper">
      <p className="glare-drop-down-button-label">{props.component_label}</p>
      <Button
        className={props.isActive ? "glare-drop-down-button-icon-flip" : ""}
        size={props.component_size}
        buttonType="icon"
      >
        <i className="ri-arrow-down-s-line"></i>
      </Button>
    </section>
  );
}
