import { HTMLAttributes } from 'react'
import './style.scss'

interface Props extends HTMLAttributes<HTMLDivElement> {
  component_label: string
  component_state: 'Info' | "Warning" | "Error" | "Success"
}

export const Alert: React.FC<Props> = ({ component_label, component_state, ...props }) => {
  return (
    <section {...props} className={`glare-alert glare-alert-${component_state}-state ${props.className}`}>
      <div className="glare-alert-icon-wrapper">
        {
          component_state == 'Error' ?
            <i className="ri-alert-fill"></i>
            :
            component_state == 'Success' ?
              <i className="ri-checkbox-circle-fill"></i>
              :
              <i className="ri-error-warning-fill"></i>
        }
      </div>

      <p className="glare-alert-label">{component_label}</p>
    </section>
  )
}

export default Alert
