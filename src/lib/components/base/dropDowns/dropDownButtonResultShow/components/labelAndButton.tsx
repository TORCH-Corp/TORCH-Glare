import Button from "@components/base/buttons/button";
interface Props {
    component_size?: "S" | "M" | "L"; // this props will change the button style size see on figma design file
    selected_value: string;
    isActive: boolean; // this will show drop down list if you pass it
}

export function LabelAndButton(props: Props) {
    return (
        <section className="glare-drop-down-button-result-show-wrapper">
            <p className="glare-drop-down-button-result-show-label">{props.selected_value}</p>
            <Button
                // the button icon will flip when you click on the button
                className={props.isActive ? "glare-drop-down-button-result-show-icon-flip" : ""}
                component_size={props.component_size}
                left_icon={<i className="ri-arrow-down-s-line"></i>}
            />
        </section>
    )
}
