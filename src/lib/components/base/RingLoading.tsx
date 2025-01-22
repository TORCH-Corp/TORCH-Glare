import { HTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { cn } from "./utils";

export const loadingFrame = cva("relative flex justify-center items-center", {
  variants: {
    size: {
      S: "w-[200px] h-[200px]",
      M: "w-[400px] h-[400px]",
      L: "w-[500px] h-[500px]",
    },
  },
  defaultVariants: {
    size: "S",
  },
});

export const loadingAnimationTextContainer = cva(
  "absolute flex justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
  {
    variants: {
      size: {
        S: "w-[150px] h-[150px]",
        M: "w-[200px] h-[200px]",
        L: "w-[300px] h-[300px]",
      },
    },
    defaultVariants: {
      size: "S",
    },
  }
);

interface Props extends HTMLAttributes<HTMLDivElement> {
  size: "S" | "M" | "L"; // this is used to change the size style of the component
}

export default function RingLoading({ size = "M", ...props }: Props) {
  return (
    <section {...props} className={cn(loadingFrame({ size }))}>
      <RingLoadingIcon
        className={
          "w-full h-full animate-spin  bg-transparent object-cover object-center"
        }
      />
      <section className={cn(loadingAnimationTextContainer({ size }))}>
        {props.children}
      </section>
    </section>
  );
}

const RingLoadingIcon = (props: HTMLAttributes<HTMLOrSVGElement>) => (
  <svg
    {...props}
    id="e7Ze8cPfGzd1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 216 216"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
  >
    <defs>
      <filter
        id="e7Ze8cPfGzd3-filter"
        x="-150%"
        width="400%"
        y="-150%"
        height="400%"
      >
        <feGaussianBlur
          id="e7Ze8cPfGzd3-filter-blur-0"
          stdDeviation="4,4"
          result="result"
        />
      </filter>
      <linearGradient
        id="e7Ze8cPfGzd4-fill"
        x1="16"
        y1="116"
        x2="126.065"
        y2="28.6871"
        spreadMethod="pad"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(0 0)"
      >
        <stop
          id="e7Ze8cPfGzd4-fill-0"
          offset="0%"
          stopColor="rgba(83,23,255,0)"
        />
        <stop id="e7Ze8cPfGzd4-fill-1" offset="100%" stopColor="#b900d8" />
      </linearGradient>
      <filter
        id="e7Ze8cPfGzd5-filter"
        x="-150%"
        width="400%"
        y="-150%"
        height="400%"
      >
        <feGaussianBlur
          id="e7Ze8cPfGzd5-filter-blur-0"
          stdDeviation="8,8"
          result="result"
        />
      </filter>
      <linearGradient
        id="e7Ze8cPfGzd6-fill"
        x1="16"
        y1="116"
        x2="126.065"
        y2="28.6871"
        spreadMethod="pad"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(0 0)"
      >
        <stop
          id="e7Ze8cPfGzd6-fill-0"
          offset="0%"
          stopColor="rgba(83,23,255,0)"
        />
        <stop id="e7Ze8cPfGzd6-fill-1" offset="100%" stopColor="#b900d8" />
      </linearGradient>
      <linearGradient
        id="e7Ze8cPfGzd7-fill"
        x1="16"
        y1="116"
        x2="126.065"
        y2="28.6871"
        spreadMethod="pad"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(0 0)"
      >
        <stop
          id="e7Ze8cPfGzd7-fill-0"
          offset="0%"
          stopColor="rgba(83,23,255,0.3)"
        />
        <stop id="e7Ze8cPfGzd7-fill-1" offset="100%" stopColor="#e75cff" />
      </linearGradient>
    </defs>
    <path
      d="M116,16c55.228,0,100,44.7715,100,100c0,55.228-44.772,100-100,100-55.2285,0-100-44.772-100-100C16,60.7715,60.7715,16,116,16Zm0,195c52.467,0,95-42.533,95-95s-42.533-95-95-95-95,42.5329-95,95c0,52.467,42.5329,95,95,95Z"
      transform="translate(-8-8)"
      fillOpacity="0.1"
    />
    <g transform="translate(-7.999968-8)" filter="url(#e7Ze8cPfGzd3-filter)">
      <path
        d="M116,18.5c0-1.3807-1.119-2.5033-2.5-2.4688-12.28.3071-24.4062,2.8745-35.7684,7.5808-12.1325,5.0255-23.1564,12.3915-32.4423,21.6773-9.2858,9.2859-16.6518,20.3098-21.6773,32.4424C18.9057,89.0939,16.3383,101.22,16.0312,113.5c-.0345,1.381,1.0881,2.5,2.4688,2.5s2.4966-1.12,2.5329-2.5c.3059-11.623,2.7434-23.0994,7.1985-33.8549c4.7742-11.5259,11.7719-21.9987,20.5934-30.8202s19.2943-15.8193,30.8203-20.5935c10.7555-4.4551,22.2319-6.8926,33.8549-7.1985c1.38-.0363,2.5-1.1522,2.5-2.5329Z"
        fill="url(#e7Ze8cPfGzd4-fill)"
      />
    </g>
    <g transform="translate(-8-8)" filter="url(#e7Ze8cPfGzd5-filter)">
      <path
        d="M116,18.5c0-1.3807-1.119-2.5033-2.5-2.4688-12.28.3071-24.4062,2.8745-35.7684,7.5808-12.1325,5.0255-23.1564,12.3915-32.4423,21.6773-9.2858,9.2859-16.6518,20.3098-21.6773,32.4424C18.9057,89.0939,16.3383,101.22,16.0312,113.5c-.0345,1.381,1.0881,2.5,2.4688,2.5s2.4966-1.12,2.5329-2.5c.3059-11.623,2.7434-23.0994,7.1985-33.8549c4.7742-11.5259,11.7719-21.9987,20.5934-30.8202s19.2943-15.8193,30.8203-20.5935c10.7555-4.4551,22.2319-6.8926,33.8549-7.1985c1.38-.0363,2.5-1.1522,2.5-2.5329Z"
        fill="url(#e7Ze8cPfGzd6-fill)"
      />
    </g>
    <path
      d="M116,18.5c0-1.3807-1.119-2.5033-2.5-2.4688-12.28.3071-24.4062,2.8745-35.7684,7.5808-12.1325,5.0255-23.1564,12.3915-32.4423,21.6773-9.2858,9.2859-16.6518,20.3098-21.6773,32.4424C18.9057,89.0939,16.3383,101.22,16.0312,113.5c-.0345,1.381,1.0881,2.5,2.4688,2.5s2.4966-1.12,2.5329-2.5c.3059-11.623,2.7434-23.0994,7.1985-33.8549c4.7742-11.5259,11.7719-21.9987,20.5934-30.8202s19.2943-15.8193,30.8203-20.5935c10.7555-4.4551,22.2319-6.8926,33.8549-7.1985c1.38-.0363,2.5-1.1522,2.5-2.5329Z"
      transform="translate(-8-8)"
      fill="url(#e7Ze8cPfGzd7-fill)"
    />
  </svg>
);
