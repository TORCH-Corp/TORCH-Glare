import { useEffect, useState } from 'react'

interface Directions {
    left: string
    top: string
    right: string
    bottom: string
}

interface Props {
    ElementRef: React.RefObject<any> // Assuming ElementRef refers to a div element
    dirClasses: Directions
    isElementActive: boolean
    trigger?: any
}

function UseDirectionCalc(props: Props) {

    const [dir, setDir] = useState(props.dirClasses.left)
    const [state, setState] = useState({
        left: false,
        right: false,
        top: false,
        bottom: false
    })

    const updateDirState = (fieldName: string, value: boolean) => {
        setState((prevState: any) => ({
            ...prevState,
            [fieldName]: value
        }));
    };

    const handlePosition = () => {

        const element = props.ElementRef.current;

        if (element) {
            const rect = element.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const isOnRight = rect.right > viewportWidth;
            const isOnLeft = rect.left < 0;
            const isOnBottom = rect.bottom > viewportHeight;
            const isOnTop = rect.top < 0;

            if (isOnRight && !state.right) {
                setDir(props.dirClasses.left)
                updateDirState("right", true)
            }
            else if (isOnLeft && !state.left) {
                setDir(props.dirClasses.right)
                updateDirState("left", true)
            }
            else if (isOnBottom && !state.bottom) {
                setDir(props.dirClasses.top)
                updateDirState("bottom", true)
            }
            else if (isOnTop && !state.top) {
                setDir(props.dirClasses.bottom)
                updateDirState("top", true)
            }

            if (state.left && state.right && !state.bottom) {
                setDir(props.dirClasses.top)
            }
            if (state.left && state.right && !state.top) {
                setDir(props.dirClasses.bottom)
            }
        }
    };


    useEffect(() => {
        handlePosition();
    }, [props.ElementRef, props.isElementActive, props.trigger]);

    return dir
}

export default UseDirectionCalc
