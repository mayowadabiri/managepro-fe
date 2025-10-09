import type { ElementType } from "react";
import { forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const stack = tv(
    {
        base: ["flex"],
        variants: {
            align: {
                baseline: ["items-baseline"],
                center: ["items-center", "text-center"],
                end: ["items-end", "text-right"],
                start: ["items-start", "text-left"],
                stretch: ["items-stretch"],
            },
            direction: {
                row: ["flex-row"],
                col: ["flex-col"],
                "row-reverse": ["flex-row-reverse"],
                "col-reverse": ["flex-col-reverse"],
            },
            justify: {
                start: ["justify-start"],
                center: ["justify-center"],
                end: ["justify-end"],
                between: ["justify-between"],
                around: ["justify-around"],
            },
            gap: {
                "0": ["gap-0"],
                px: ["gap-px"],
                "0.5": ["gap-0.5"],
                "1": ["gap-1"],
                "1.5": ["gap-1.5"],
                "2": ["gap-2"],
                "2.5": ["gap-2.5"],
                "3": ["gap-3"],
                "3.5": ["gap-3.5"],
                "4": ["gap-4"],
                "4.5": ["gap-4.5"],
                "5": ["gap-5"],
                "6": ["gap-6"],
                "7": ["gap-7"],
                "8": ["gap-8"],
                "9": ["gap-9"],
                "10": ["gap-10"],
                "11": ["gap-11"],
                "12": ["gap-12"],
                "14": ["gap-14"],
                "16": ["gap-16"],
                "20": ["gap-20"],
                "24": ["gap-24"],
                "28": ["gap-28"],
                "32": ["gap-32"],
                "36": ["gap-36"],
                "40": ["gap-40"],
                "44": ["gap-44"],
                "48": ["gap-48"],
                "52": ["gap-52"],
                "56": ["gap-56"],
                "60": ["gap-60"],
                "64": ["gap-64"],
                "72": ["gap-72"],
                "80": ["gap-80"],
                "96": ["gap-96"],
            },
            width: {
                full: ["w-full"],
                fit: ["w-fit"],
            },
            withBorder: {
                true: ["border border-stroke"],
                false: [],
            },
        },
        defaultVariants: {
            align: "start",
            direction: "col",
            width: "full",
        },
    },
    {}
);

interface StackProps<T extends ElementType = "div">
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof stack> {
    component?: T;
}

function Stack<T extends ElementType = "div">(
    props: StackProps<T>,
    ref: React.Ref<HTMLDivElement>
) {
    const {
        align,
        className,
        gap,
        width,
        direction,
        justify,
        component,
        withBorder,
        ...rest
    } = props;
    const ElementTag = component || "div";

    return (
        <ElementTag
            ref={ref}
            className={stack({
                align,
                className,
                direction,
                gap,
                justify,
                width,
                withBorder,
            })}
            {...rest}
        />
    );
}

export default forwardRef(Stack);
