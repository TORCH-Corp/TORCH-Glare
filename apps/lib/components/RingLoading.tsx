import { HTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../utils/cn";

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

export const loadingAnimationTextContainer = cva("", {
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
});

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: "S" | "M" | "L"; // this is used to change the size style of the component
  theme?: "light" | "dark" | "default";
}

export default function RingLoading({ className, theme = "light", size = "M", ...props }: Props) {
  return (
    <section data-theme={theme} {...props} className={cn(loadingFrame({ size }), className)}>
      <DarkRingLoadingIcon
        data-theme={theme}
        className="w-full h-full animate-spin bg-transparent object-cover object-center hidden data-[theme=dark]:flex"
      />

      {/* Light Theme Loader */}
      <RingLoadingIcon
        data-theme={theme}
        className="w-full h-full animate-spin bg-transparent object-cover object-center hidden data-[theme=light]:flex"
      />
      <section
        className={cn(
          "absolute flex justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        )}
      >
        {props.children}
      </section>
    </section>
  );
}




const DarkRingLoadingIcon = (props: HTMLAttributes<HTMLOrSVGElement>) => (
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



const RingLoadingIcon = (props: HTMLAttributes<HTMLOrSVGElement>) => (
  <svg {...props} width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M200 100C200 155.228 155.228 200 100 200C44.7715 200 0 155.228 0 100C0 44.7715 44.7715 0 100 0C155.228 0 200 44.7715 200 100ZM5 100C5 152.467 47.5329 195 100 195C152.467 195 195 152.467 195 100C195 47.5329 152.467 5 100 5C47.5329 5 5 47.5329 5 100Z" fill="black" fillOpacity="0.1" />
    <path d="M197.5 100C198.881 100 200.003 98.8805 199.969 97.5002C199.662 85.22 197.094 73.0938 192.388 61.7317C187.362 49.5991 179.997 38.5752 170.711 29.2893C161.425 20.0035 150.401 12.6375 138.268 7.61205C126.906 2.90567 114.78 0.338305 102.5 0.031247C101.119 -0.00326585 100 1.11929 100 2.5C100 3.88071 101.12 4.99656 102.5 5.03289C114.123 5.33884 125.599 7.77635 136.355 12.2314C147.881 17.0056 158.354 24.0033 167.175 32.8249C175.997 41.6464 182.994 52.1191 187.769 63.6451C192.224 74.4006 194.661 85.8767 194.967 97.5002C195.003 98.8805 196.119 100 197.5 100Z" fill="url(#paint0_linear_10856_138364)" />
    <defs>
      <linearGradient id="paint0_linear_10856_138364" x1="3.4045" y1="-9.09091" x2="225.705" y2="19.8973" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D500F9" />
        <stop offset="1" stopColor="#5317FF" />
      </linearGradient>
    </defs>
  </svg>
);

import { HTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../utils/cn";

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

export const loadingAnimationTextContainer = cva("", {
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
});

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: "S" | "M" | "L"; // this is used to change the size style of the component
  theme?: "light" | "dark" | "default";
}

export default function RingLoading({ className, theme = "light", size = "M", ...props }: Props) {
  return (
    <section data-theme={theme} {...props} className={cn(loadingFrame({ size }), className)}>
      <DarkRingLoadingIcon
        data-theme={theme}
        className="w-full h-full animate-spin bg-transparent object-cover object-center hidden data-[theme=dark]:flex"
      />

      {/* Light Theme Loader */}
      <RingLoadingIcon
        data-theme={theme}
        className="w-full h-full animate-spin bg-transparent object-cover object-center hidden data-[theme=light]:flex"
      />
      <section
        className={cn(
          "absolute flex justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        )}
      >
        {props.children}
      </section>
    </section>
  );
}




const DarkRingLoadingIcon = (props: HTMLAttributes<HTMLOrSVGElement>) => (
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



const RingLoadingIcon = (props: HTMLAttributes<HTMLOrSVGElement>) => (
  <svg {...props} width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M200 100C200 155.228 155.228 200 100 200C44.7715 200 0 155.228 0 100C0 44.7715 44.7715 0 100 0C155.228 0 200 44.7715 200 100ZM5 100C5 152.467 47.5329 195 100 195C152.467 195 195 152.467 195 100C195 47.5329 152.467 5 100 5C47.5329 5 5 47.5329 5 100Z" fill="black" fillOpacity="0.1" />
    <path d="M197.5 100C198.881 100 200.003 98.8805 199.969 97.5002C199.662 85.22 197.094 73.0938 192.388 61.7317C187.362 49.5991 179.997 38.5752 170.711 29.2893C161.425 20.0035 150.401 12.6375 138.268 7.61205C126.906 2.90567 114.78 0.338305 102.5 0.031247C101.119 -0.00326585 100 1.11929 100 2.5C100 3.88071 101.12 4.99656 102.5 5.03289C114.123 5.33884 125.599 7.77635 136.355 12.2314C147.881 17.0056 158.354 24.0033 167.175 32.8249C175.997 41.6464 182.994 52.1191 187.769 63.6451C192.224 74.4006 194.661 85.8767 194.967 97.5002C195.003 98.8805 196.119 100 197.5 100Z" fill="url(#paint0_linear_10856_138364)" />
    <defs>
      <linearGradient id="paint0_linear_10856_138364" x1="3.4045" y1="-9.09091" x2="225.705" y2="19.8973" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D500F9" />
        <stop offset="1" stopColor="#5317FF" />
      </linearGradient>
    </defs>
  </svg>
);
