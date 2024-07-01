import { HTMLAttributes } from 'react'
import './style.scss'

interface Props extends HTMLAttributes<HTMLDivElement> {

}
export default function CounterCircle(props: Props) {
  return (
    <div className='glare-stepper-counter-circle'></div>
  )
}
