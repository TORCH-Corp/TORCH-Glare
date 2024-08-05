import { Label } from "@/components/base/labels/label"
import './style.scss'
interface Props {
  active: boolean
  active_label?: string
  disabled_label?: string
}
export function SwitcherLabelSlider(props: Props) {
  return (
    <section className={"glare-switcher-label-slider" + (props.active ? " glare-switcher-label-slider-active" : "")}>
      <Label component_size="M" label={props.active_label} name={undefined} />
      <Label component_size="M" label={props.disabled_label} name={undefined} />
    </section>
  )
}
