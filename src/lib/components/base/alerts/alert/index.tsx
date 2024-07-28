import { HTMLAttributes, useEffect, useRef, useState } from 'react'
import './style.scss'
import { AlertIcon } from './components/alertIcon'

interface Props extends HTMLAttributes<HTMLDivElement> {
  component_label: string
  component_state: 'Info' | "Warning" | "Error" | "Success" // the component styles see on figma design file
}

export const Alert: React.FC<Props> = ({ component_label, component_state, ...props }) => {
  // to set height of the parent to the icon container
  const parentRef = useRef<HTMLDivElement>(null)
  const [parentHeight, setParentHeight] = useState(0)
  useEffect(() => {
    if (!parentRef.current) return
    setParentHeight(parentRef.current.offsetHeight)
  }, [parentRef.current])

  return (
    <section ref={parentRef}  {...props} className={`glare-alert glare-alert-${component_state}-state ${props.className}`}>
      <section style={{ height: `${parentHeight}px` }} className="glare-alert-icon-wrapper">
        <AlertIcon component_state={component_state} />
      </section>
      <p className="glare-alert-label">{component_label}</p>
    </section>
  )
}

export default Alert
