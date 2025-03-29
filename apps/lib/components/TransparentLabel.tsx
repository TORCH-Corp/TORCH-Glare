import { cn } from "../utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

export const TransparentLabelStyles = cva(
    "[mask-image:linear-gradient(to_right,black_0%,black_0%,black_85%,transparent_100%)] rtl:[mask-image:linear-gradient(to_left,black_0%,black_0%,black_85%,transparent_100%)]",
    {
        variants: {
            size: {
                "display-large-bold": "typography-display-large-bold",
                "display-large-semibold": "typography-display-large-semibold",
                "display-large-medium": "typography-display-large-medium",
                "display-large-regular": "typography-display-large-regular",
                "display-medium-bold": "typography-display-medium-bold",
                "display-medium-semibold": "typography-display-medium-semibold",
                "display-medium-medium": "typography-display-medium-medium",
                "display-medium-regular": "typography-display-medium-regular",
                "display-small-bold": "typography-display-small-bold",
                "display-small-semibold": "typography-display-small-semibold",
                "display-small-medium": "typography-display-small-medium",
                "display-small-regular": "typography-display-small-regular",
                "headers-large-bold": "typography-headers-large-bold",
                "headers-large-semibold": "typography-headers-large-semibold",
                "headers-large-medium": "typography-headers-large-medium",
                "headers-large-regular": "typography-headers-large-regular",
                "headers-medium-bold": "typography-headers-medium-bold",
                "headers-medium-semibold": "typography-headers-medium-semibold",
                "headers-medium-medium": "typography-headers-medium-medium",
                "headers-medium-regular": "typography-headers-medium-regular",
                "headers-small-bold": "typography-headers-small-bold",
                "headers-small-semibold": "typography-headers-small-semibold",
                "headers-small-medium": "typography-headers-small-medium",
                "headers-small-regular": "typography-headers-small-regular",
                "body-large-bold": "typography-body-large-bold",
                "body-large-semibold": "typography-body-large-semibold",
                "body-large-medium": "typography-body-large-medium",
                "body-large-regular": "typography-body-large-regular",
                "body-medium-bold": "typography-body-medium-bold",
                "body-medium-semibold": "typography-body-medium-semibold",
                "body-medium-medium": "typography-body-medium-medium",
                "body-medium-regular": "typography-body-medium-regular",
                "body-small-bold": "typography-body-small-bold",
                "body-small-semibold": "typography-body-small-semibold",
                "body-small-medium": "typography-body-small-medium",
                "body-small-regular": "typography-body-small-regular",
                "labels-large-bold": "typography-labels-large-bold",
                "labels-large-semibold": "typography-labels-large-semibold",
                "labels-large-medium": "typography-labels-large-medium",
                "labels-large-regular": "typography-labels-large-regular",
                "labels-medium-bold": "typography-labels-medium-bold",
                "labels-medium-semibold": "typography-labels-medium-semibold",
                "labels-medium-medium": "typography-labels-medium-medium",
                "labels-medium-regular": "typography-labels-medium-regular",
                "labels-small-bold": "typography-labels-small-bold",
                "labels-small-semibold": "typography-labels-small-semibold",
                "labels-small-medium": "typography-labels-small-medium",
                "labels-small-regular": "typography-labels-small-regular",
            },
        },
        defaultVariants: {
            size: "body-medium-regular",
        }
    }
);

interface Props extends HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof TransparentLabelStyles> { }

export const TransparentLabel = ({ size, className, ...props }: Props) => {
    return (
        <p {...props} className={cn(TransparentLabelStyles({ size }), className)}></p>
    );
};
