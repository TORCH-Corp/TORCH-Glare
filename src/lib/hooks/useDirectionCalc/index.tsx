import { useEffect, useState } from 'react';
import { Props } from './types';
import { getElementPositionStatus } from './utils/getElementPositionStatus';
import { determineDirection } from './utils/ determineDirection';

// this hook used to change the direction of the child based on the viewport
// you should pass your component reference
// you should pass your direction classes in the dirClasses prop in order to change the direction of your component based of the top, bottom, left, right position
// for each position you should pass your direction class name to make the hook select the right direction
// isElementActive is used to check if the element is active or not AND THIS WILL HELP to recalculate the direction if the element is not active
// trigger is used to spread additional props could by anything just for recalculating the direction

function UseDirectionCalc({ dirClasses, ElementRef, isElementActive, trigger }: Props) {

    const [dir, setDir] = useState(dirClasses.left);
    // storedPositionStatus is used to avoid infinite loops by store the old position status
    const [storedPositionStatus, setStoredPositionStatus] = useState({
        left: false,
        right: false,
        top: false,
        bottom: false
    });

    const handlePosition = () => {
        if (!ElementRef.current) return
        const element = ElementRef.current;
        if (element) {
            const newPositionStatus = getElementPositionStatus(element);
            const calcPosition = determineDirection(storedPositionStatus, setStoredPositionStatus, newPositionStatus, dirClasses);
            if (calcPosition !== undefined) setDir(calcPosition);
        }
    };


    useEffect(() => {
        // Define the event handlers
        const handleMouseEnter = () => handlePosition();
        const handleResize = () => handlePosition();
        const handleScroll = () => handlePosition();

        // Get the current element from the ref
        const currentElement = ElementRef.current;

        if (currentElement) {
            // Add event listeners
            currentElement.addEventListener('mouseenter', handleMouseEnter);
            window.addEventListener('resize', handleResize);
            window.addEventListener('scroll', handleScroll);
        }

        // Cleanup function to remove event listeners
        return () => {
            if (currentElement) {
                currentElement.removeEventListener('mouseenter', handleMouseEnter);
            }
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [ElementRef, isElementActive, trigger]);


    // here we are returning the direction state with the selected class name 
    return dir;
}

export default UseDirectionCalc;
