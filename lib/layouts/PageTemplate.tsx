'use client'
import { cn } from "../utils/cn"
import { HTMLAttributes } from "react"

interface Props extends HTMLAttributes<HTMLDivElement> {

}
export const PageTemplate = (Props: Props) => {
  return (
    <div {...Props} className={cn('max-w-[800px] flex flex-col py-[32px] m-auto', Props.className)}>

    </div>
  )
}


export const PageTemplateSection = (Props: Props) => {
  return (
    <div {...Props} className={cn('flex flex-col gap-[32px] flex-1 py-[32px]', Props.className)}>

    </div>
  )
}
