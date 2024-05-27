import { HTMLAttributes } from 'react'
import './style.scss'

interface Props extends HTMLAttributes<HTMLDivElement> {
  component_label: string
  component_state: 'Info' | "Warning" | "Error" | "Success"
}

const Alert = (props: Props) => {
  return (
    <section {...props} className={`glare-alert glare-alert-${props.component_state}-state ${props.className}`}>
      <div className="glare-alert-icon-wrapper">
        {
          props.component_state == 'Error' ?
            <i className="ri-alert-fill"></i>
            :
            props.component_state == 'Success' ?
              <i className="ri-checkbox-circle-fill"></i>
              :
              <i className="ri-error-warning-fill"></i>
        }
      </div>

      <p className="glare-alert-label">{props.component_label}</p>
    </section>
  )
}

export default Alert
