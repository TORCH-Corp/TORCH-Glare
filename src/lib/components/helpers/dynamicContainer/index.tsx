import { ReactNode, useRef } from 'react'
import './style.scss'
import UseDirectionCalc from '../../../hooks/useDirectionCalc'

interface Props {
  children: ReactNode
  active: boolean
  onClick?: () => any
}

export function DynamicContainer(props: Props) {

  const ref = useRef<any>(null)
  const dir = UseDirectionCalc({
    ElementRef: ref,
    dirClasses: {
      left: "",
      right: "",
      top: "Dynamic-Container-top",
      bottom: ""
    },
    isElementActive: props.active,
    trigger: props.children
  })

  return (
    <section onClick={props.onClick} ref={ref} className={`Dynamic-Container ${dir}`} style={{ display: props.active ? "flex" : "none" }}>
      {props.children}
    </section>
  )
}
