interface Props {
    component_state: 'Info' | "Warning" | "Error" | "Success" // the component styles see on figma design file
}
export function AlertIcon(props: Props) {
    return (
        // icons for the different states
        props.component_state == 'Error' ?
            <i className="ri-alert-fill"></i>
            :
            props.component_state == 'Success' ?
                <i className="ri-checkbox-circle-fill"></i>
                :
                <i className="ri-error-warning-fill"></i> // default icon  
    )
}
