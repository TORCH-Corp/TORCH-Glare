import { ComponentProps, forwardRef, HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react';
import { getDaysInMonth } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { InputField } from './InputField';

interface PickerValue {
    [key: string]: string | number
}
function getDayArray(year: number, month: number): string[] {
    const dayCount = getDaysInMonth(new Date(year, month - 1));
    return Array.from({ length: dayCount }, (_, i) => String(i + 1).padStart(2, '0'));
}

interface IosDatePickerProps extends Omit<ComponentProps<typeof InputField>, 'onChange'> {
    onChange?: (e: Date) => void;
    theme?: "dark" | "light" | "default";
}

export const IosDatePicker = forwardRef<HTMLInputElement, IosDatePickerProps>(({ theme = "dark", onChange, ...props }, forwardedRef) => {
    const today = new Date();
    const pickerValueData = {
        year: String(today.getFullYear()),
        month: String(today.getMonth() + 1).padStart(2, '0'),
        day: String(today.getDate()).padStart(2, '0'),
    };

    const [pickerValue, setPickerValue] = useState<PickerValue>(pickerValueData);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 150 }, (_, i) => `${currentYear - 100 + i}`);
    const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, ''));
    const days = getDayArray(Number(pickerValue.year), Number(pickerValue.month));
    const monthsNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];
    const handlePickerChange = (newValue: Partial<PickerValue>, key: string) => {
        // Create a copy of the current pickerValue
        const updatedValue: any = { ...pickerValue, ...newValue };

        // If the year or month changes, recalculate the days
        if (key === 'year' || key === 'month') {
            const newDayArray = getDayArray(Number(updatedValue.year), Number(updatedValue.month));
            updatedValue.day = newDayArray.includes(updatedValue.day as string)
                ? updatedValue.day
                : newDayArray[newDayArray.length - 1]; // Ensure the day is valid
        }

        // Update the state with the new value
        setPickerValue(updatedValue);

        // Create a Date object from the updated value
        const newDate = new Date(`${updatedValue.year}-${updatedValue.month}-${updatedValue.day}`);

        // Call the onChange callback with the Date object
        if (onChange) {
            onChange(newDate);
        }
    };

    return (
        <Popover open>
            <PopoverTrigger data-theme={theme} className='w-full flex-1' >
                <InputField theme={theme} {...props} ref={forwardedRef} value={`${pickerValue.year}/${pickerValue.month}/${pickerValue.day}`} readOnly />
            </PopoverTrigger>
            <PopoverContent data-theme={theme} dir="ltr" variant={props.variant} className="overflow-hidden w-[285px] flex justify-center items-center p-[6px] pt-[30px]">
                <div className="flex justify-evenly items-center w-full absolute top-0 py-[6px]">
                    <p className="text-content-system-global-secondary typography-headers-medium-regular">Year</p>
                    <div className="flex justify-center items-center self-center">
                        <span className="h-[13px] w-[1px] bg-border-system-global-secondary rounded-[3px]"></span>
                        <p className="text-content-system-global-secondary typography-headers-medium-regular px-[18px]">Month</p>
                        <span className="h-[13px] w-[1px] bg-border-system-global-secondary rounded-[3px]"></span>
                    </div>
                    <p className="text-content-system-global-secondary typography-headers-medium-regular">Day</p>
                </div>
                <div className='absolute inset-0 w-full h-full flex justify-center items-center z-0 p-[6px]'>
                    <div className='w-full h-[42px] rounded-[8px] bg-background-system-body-tertiary mt-[23px]'></div>
                </div>

                <div className="relative flex w-full h-[300px] max-w-full mx-auto text-white"
                    style={{
                        maskImage: 'linear-gradient(to top, transparent, transparent 10%, white 50%, white 19%, transparent 75%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to top, transparent, transparent 10%, white 50%, white 19%, transparent 75%, transparent)',
                    }}
                >
                    <IosPickerItem
                        onValueSelect={(value) => {
                            console.log(value, 'year')
                            handlePickerChange({ ...pickerValue, year: value }, 'year')
                        }}
                        slideData={years}
                        perspective="left"
                    >
                        {
                            years.map((value, index) => (
                                <SliderItem key={value}>
                                    {value}
                                </SliderItem>
                            ))
                        }
                    </IosPickerItem>
                    <IosPickerItem
                        onValueSelect={(value) => {
                            console.log(value, 'month')
                            handlePickerChange({ ...pickerValue, month: value }, 'month')
                        }}
                        slideData={months}
                        perspective="left"
                    >
                        {
                            months.map((value, index) => (
                                <SliderItem key={value}>
                                    {
                                        `${monthsNames[Number(value) - 1].substring(0, 3)}-${value}`
                                    }
                                </SliderItem>
                            ))
                        }
                    </IosPickerItem>
                    <IosPickerItem
                        slideData={days}
                        onValueSelect={(value) => {
                            console.log(value, 'day')
                        }}
                        perspective="right"
                    >
                        {
                            days.map((value, index) => (
                                <SliderItem key={value}>
                                    {value}
                                </SliderItem>
                            ))
                        }
                    </IosPickerItem>
                </div>
            </PopoverContent>
        </Popover>
    );
});


// using with react hook form lib
/* 
 <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <SlideDatePicker
            {...field}
            onChange={(value: Date) => field.onChange(value)}
          />
        )}
      />
      <button>submit</button>
    </form>
*/



import { EmblaCarouselType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'

const CIRCLE_DEGREES = 360
const WHEEL_ITEM_SIZE = 32
const WHEEL_ITEM_COUNT = 18
const WHEEL_ITEMS_IN_VIEW = 8
const WHEEL_ITEM_RADIUS = CIRCLE_DEGREES / WHEEL_ITEM_COUNT
const IN_VIEW_DEGREES = WHEEL_ITEM_RADIUS * WHEEL_ITEMS_IN_VIEW
const WHEEL_RADIUS = Math.round(
    WHEEL_ITEM_SIZE / 2 / Math.tan(Math.PI / WHEEL_ITEM_COUNT)
)

const isInView = (wheelLocation: number, slidePosition: number): boolean =>
    Math.abs(wheelLocation - slidePosition) < IN_VIEW_DEGREES

const setSlideStyles = (
    emblaApi: EmblaCarouselType,
    index: number,
    loop: boolean,
    slideData: number,
    totalRadius: number
): void => {
    const slideNode = emblaApi.slideNodes()[index]
    const wheelLocation = emblaApi.scrollProgress() * totalRadius
    const positionDefault = emblaApi.scrollSnapList()[index] * totalRadius
    const positionLoopStart = positionDefault + totalRadius
    const positionLoopEnd = positionDefault - totalRadius

    let inView = false
    let angle = index * -WHEEL_ITEM_RADIUS

    if (isInView(wheelLocation, positionDefault)) {
        inView = true
    }

    if (loop && isInView(wheelLocation, positionLoopEnd)) {
        inView = true
        angle = -CIRCLE_DEGREES + (slideData - index) * WHEEL_ITEM_RADIUS
    }

    if (loop && isInView(wheelLocation, positionLoopStart)) {
        inView = true
        angle = -(totalRadius % CIRCLE_DEGREES) - index * WHEEL_ITEM_RADIUS
    }

    if (inView) {
        slideNode.style.opacity = '1'
        slideNode.style.transform = `translateY(-${index * 100}%) rotateX(${angle}deg) translateZ(${WHEEL_RADIUS}px)`
    } else {
        slideNode.style.opacity = '0'
        slideNode.style.transform = 'none'
    }
}

const setContainerStyles = (
    emblaApi: EmblaCarouselType,
    wheelRotation: number
): void => {
    emblaApi.containerNode().style.transform = `translateZ(${0}px) rotateX(${wheelRotation}deg)`
}

interface PropType extends React.HTMLAttributes<HTMLDivElement> {
    loop?: boolean
    slideData: string[]
    perspective: 'left' | 'right'
    onValueSelect?: (value: string) => void; // Callback to pass the selected value to the parent
}

const IosPickerItem: React.FC<PropType> = ({ onValueSelect, slideData, perspective, loop = false, ...props }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop,
        axis: 'y',
        dragFree: true,
        containScroll: false,
        watchSlides: false
    })
    const rootNodeRef = useRef<HTMLDivElement>(null)
    const totalRadius = slideData.length * WHEEL_ITEM_RADIUS
    const rotationOffset = loop ? 0 : WHEEL_ITEM_RADIUS

    const inactivateEmblaTransform = useCallback(
        (emblaApi: EmblaCarouselType) => {
            if (!emblaApi) return
            const { translate, slideLooper } = emblaApi.internalEngine()
            translate.clear()
            translate.toggleActive(false)
            slideLooper.loopPoints.forEach(({ translate }) => {
                translate.clear()
                translate.toggleActive(false)
            })
        },
        []
    )

    const rotateWheel = useCallback(
        (emblaApi: EmblaCarouselType) => {
            const rotation = (slideData.length) * WHEEL_ITEM_RADIUS - rotationOffset
            const wheelRotation = rotation * emblaApi.scrollProgress()
            setContainerStyles(emblaApi, wheelRotation)
            emblaApi.slideNodes().forEach((_, index) => {
                setSlideStyles(emblaApi, index, loop, slideData.length, totalRadius)
            })
        },
        [slideData, rotationOffset, totalRadius]
    )

    // Function to handle selection
    const handleSelection = useCallback(
        (emblaApi: EmblaCarouselType) => {
            const selectedIndex = emblaApi.selectedScrollSnap();
            const selectedValue = slideData[selectedIndex];
            if (onValueSelect) {
                onValueSelect(selectedValue); // Pass the selected value to the parent
            }
        },
        [slideData]
    );
    useEffect(() => {
        if (!emblaApi) return;

        emblaApi.on('pointerUp', (emblaApi) => {
            const { scrollTo, target, location } = emblaApi.internalEngine();
            const diffToTarget = target.get() - location.get();
            const factor = Math.abs(diffToTarget) < WHEEL_ITEM_SIZE / 2.5 ? 10 : 0.1;
            const distance = diffToTarget * factor;
            scrollTo.distance(distance, true);
        });

        emblaApi.on('scroll', rotateWheel);
        emblaApi.on('select', handleSelection); // Listen for slide selection changes

        emblaApi.on('reInit', (emblaApi) => {
            inactivateEmblaTransform(emblaApi);
            rotateWheel(emblaApi);
            handleSelection(emblaApi); // Initialize the selected value
        });

        inactivateEmblaTransform(emblaApi);
        rotateWheel(emblaApi);
        handleSelection(emblaApi); // Initialize the selected value
    }, [emblaApi]);

    return (
        <div {...props} className="flex items-center justify-center w-[90px] h-full text-[1.8rem]">
            <div className="min-w-full h-full flex items-center justify-center overflow-hidden touch-pan-x" ref={rootNodeRef}>
                <div
                    className={`w-[75px] h-[32px] perspective-[3200px] select-none ${perspective === 'left'
                        ? '[perspective-origin:calc(50%+130px)]'
                        : '[perspective-origin:calc(50%-130px)]'
                        }`}
                    ref={emblaRef}
                >
                    <div className="w-full h-full [transform-style:preserve-3d] will-change-transform scroll-smooth">
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    )
}

interface SliderItemType extends HTMLAttributes<HTMLDivElement> { }
const SliderItem = (props: SliderItemType) => {
    return (
        <div className="w-full h-full text-[19px] text-center flex items-center justify-center [backface-visibility:hidden] opacity-0" {...props}>
            {props.children}
        </div>
    )
}