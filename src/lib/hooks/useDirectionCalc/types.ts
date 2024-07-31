export interface DirectionsClasses {
    left: string
    top: string
    right: string
    bottom: string
}

export interface DirectionsStatus {
    left: boolean
    top: boolean
    right: boolean
    bottom: boolean
}

export interface Props {
    ElementRef: React.RefObject<HTMLElement> // Assuming ElementRef refers to a div element
    dirClasses: DirectionsClasses
}
