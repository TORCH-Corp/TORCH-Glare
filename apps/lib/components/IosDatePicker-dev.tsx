import { ComponentProps, forwardRef, HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react';
import { getDaysInMonth } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { InputField } from './InputField';

interface PickerValue {
    [key: string]: string | number;
}

function getDayArray(year: number, month: number): string[] {
    const dayCount = getDaysInMonth(new Date(year, month - 1));
    return Array.from({ length: dayCount }, (_, i) => String(i + 1).padStart(2, '0'));
}

interface IosDatePickerProps extends Omit<ComponentProps<typeof InputField>, 'onChange'> {
    onChange?: (e: Date) => void;
    theme?: "dark" | "light" | "default";
}

export const IosDatePicker = forwardRef<HTMLInputElement, IosDatePickerProps>(
    ({ theme = "dark", onChange, ...props }, forwardedRef) => {
        const today = new Date();

        const [year, setYear] = useState(String(today.getFullYear()));
        const [month, setMonth] = useState(String(today.getMonth() + 1).padStart(2, '0'));
        const [day, setDay] = useState(String(today.getDate()).padStart(2, '0'));

        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 150 }, (_, i) => `${currentYear - 100 + i}`);
        const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
        const days = getDayArray(Number(year), Number(month));
        const monthsNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December",
        ];

        // Update handlers for each state separately
        const handleYearChange = (value: string) => {
            setYear(value);
            const newDays = getDayArray(Number(value), Number(month));
            if (!newDays.includes(day)) {
                setDay(newDays[newDays.length - 1]);
            }
            triggerOnChange(value, month, day);
        };

        const handleMonthChange = (value: string) => {
            setMonth(value);
            const newDays = getDayArray(Number(year), Number(value));
            if (!newDays.includes(day)) {
                setDay(newDays[newDays.length - 1]);
            }
            triggerOnChange(year, value, day);
        };

        const handleDayChange = (value: string) => {
            setDay(value);
            triggerOnChange(year, month, value);
        };

        // Function to trigger onChange callback
        const triggerOnChange = (y: string, m: string, d: string) => {
            if (onChange) {
                onChange(new Date(`${y}-${m}-${d}`));
            }
        };

        return (
            <Popover>
                <PopoverTrigger data-theme={theme} className='w-full flex-1'>
                    <InputField
                        theme={theme}
                        {...props}
                        ref={forwardedRef}
                        value={`${year}/${month}/${day}`}
                        readOnly
                    />
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

                    <div
                        className="relative flex w-full h-[300px] max-w-full mx-auto text-white"
                        style={{
                            maskImage: 'linear-gradient(to top, transparent, transparent 10%, white 50%, white 19%, transparent 75%, transparent)',
                            WebkitMaskImage: 'linear-gradient(to top, transparent, transparent 10%, white 50%, white 19%, transparent 75%, transparent)',
                        }}
                    >
                        <IosPickerItem
                            onValueSelect={handleYearChange}
                            slideData={years}
                            perspective="left"
                            selectedValue={year}
                        >
                            {years.map((value) => (
                                <SliderItem key={value}>{value}</SliderItem>
                            ))}
                        </IosPickerItem>
                        <IosPickerItem
                            onValueSelect={handleMonthChange}
                            slideData={months}
                            perspective="left"
                            selectedValue={month}
                        >
                            {months.map((value) => (
                                <SliderItem key={value}>
                                    {`${monthsNames[Number(value) - 1].substring(0, 3)}-${value}`}
                                </SliderItem>
                            ))}
                        </IosPickerItem>
                        <IosPickerItem
                            onValueSelect={handleDayChange}
                            slideData={getDayArray(Number(year), Number(month))}
                            perspective="right"
                            selectedValue={day}
                        >
                            {getDayArray(Number(year), Number(month)).map((value) => (
                                <SliderItem key={`${value}-days`}>{value}</SliderItem>
                            ))}
                        </IosPickerItem>
                    </div>
                </PopoverContent>
            </Popover>
        );
    }
);

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


const CIRCLE_DEGREES = 360;
const WHEEL_ITEM_SIZE = 32;
const WHEEL_ITEM_COUNT = 18;
const WHEEL_ITEMS_IN_VIEW = 4;
const WHEEL_ITEM_RADIUS = CIRCLE_DEGREES / WHEEL_ITEM_COUNT;
const IN_VIEW_DEGREES = WHEEL_ITEM_RADIUS * WHEEL_ITEMS_IN_VIEW;
const WHEEL_RADIUS = Math.round(
    WHEEL_ITEM_SIZE / 2 / Math.tan(Math.PI / WHEEL_ITEM_COUNT)
);

const isInView = (wheelLocation: number, slidePosition: number): boolean =>
    Math.abs(wheelLocation - slidePosition) < IN_VIEW_DEGREES;

interface PropType extends HTMLAttributes<HTMLDivElement> {
    loop?: boolean;
    slideData: string[];
    selectedValue: any
    perspective: 'left' | 'right';
    onValueSelect?: (value: string) => void; // Callback to pass the selected value to the parent
}

const IosPickerItem: React.FC<PropType> = ({
    onValueSelect,
    slideData,
    perspective,
    selectedValue,
    loop = false,
    ...props
}) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop,
        axis: 'y',
        dragFree: true,
        containScroll: false,
        watchSlides: false,
    });

    const rootNodeRef = useRef<HTMLDivElement>(null);
    const [totalRadius, setTotalRadius] = useState(slideData.length * WHEEL_ITEM_RADIUS);
    const [rotationOffset, setRotationOffset] = useState(loop ? 0 : WHEEL_ITEM_RADIUS);

    // Update totalRadius and rotationOffset when data or loop changes
    useEffect(() => {
        setTotalRadius(slideData.length * WHEEL_ITEM_RADIUS);
        setRotationOffset(loop ? 0 : WHEEL_ITEM_RADIUS);
    }, [slideData, loop]);

    const inactivateEmblaTransform = useCallback(
        (emblaApi: EmblaCarouselType) => {
            if (!emblaApi) return;
            const { translate, slideLooper } = emblaApi.internalEngine();
            translate.clear();
            translate.toggleActive(false);
            slideLooper.loopPoints.forEach(({ translate }) => {
                translate.clear();
                translate.toggleActive(false);
            });
        },
        []
    );

    console.log(slideData.length)


    const rotateWheel = useCallback(
        (emblaApi: EmblaCarouselType) => {
            const rotation = slideData.length * WHEEL_ITEM_RADIUS - rotationOffset;
            const wheelRotation = rotation * emblaApi.scrollProgress();
            emblaApi.containerNode().style.transform = `translateZ(${0}px) rotateX(${wheelRotation}deg)`;
            emblaApi.slideNodes().forEach((_, index) => {
                setSlideStyles(emblaApi, index, loop, slideData.length, totalRadius);
            });
        },
        [slideData, rotationOffset, totalRadius, loop]
    );

    const setSlideStyles = useCallback(
        (
            emblaApi: EmblaCarouselType,
            index: number,
            loop: boolean,
            dataLength: number,
            totalRadius: number
        ) => {
            const slideNode = emblaApi.slideNodes()[index];
            const wheelLocation = emblaApi.scrollProgress() * totalRadius;
            const positionDefault = emblaApi.scrollSnapList()[index] * totalRadius;
            const positionLoopStart = positionDefault + totalRadius;
            const positionLoopEnd = positionDefault - totalRadius;

            let inView = false;
            let angle = index * -WHEEL_ITEM_RADIUS;

            if (isInView(wheelLocation, positionDefault)) {
                inView = true;
            }

            if (loop && isInView(wheelLocation, positionLoopEnd)) {
                inView = true;
                angle = -CIRCLE_DEGREES + (dataLength - index) * WHEEL_ITEM_RADIUS;
            }

            if (loop && isInView(wheelLocation, positionLoopStart)) {
                inView = true;
                angle = -(totalRadius % CIRCLE_DEGREES) - index * WHEEL_ITEM_RADIUS;
            }

            if (inView) {
                slideNode.style.opacity = '1';
                slideNode.style.transform = `translateY(-${index * 100}%) rotateX(${angle}deg) translateZ(${WHEEL_RADIUS}px)`;
            } else {
                slideNode.style.opacity = '0';
                slideNode.style.transform = 'none';
            }
        },
        [loop, totalRadius]
    );

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
        });

        inactivateEmblaTransform(emblaApi);
        rotateWheel(emblaApi);
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
                    <div className="flex flex-col w-full h-full [transform-style:preserve-3d] will-change-transform scroll-smooth">
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface SliderItemType extends HTMLAttributes<HTMLDivElement> { }
const SliderItem = (props: SliderItemType) => {
    return (
        <div className="w-full h-full text-[19px] text-center flex items-center justify-center [backface-visibility:hidden] opacity-0" {...props}>
            {props.children}
        </div>
    );
};

