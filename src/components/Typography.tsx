import { ElementType } from "react";
import { tv, VariantProps } from "tailwind-variants";

const typography = tv({
    base: ["font-(--font-inter)"],
    variants: {
        align: {
            left: ["text-left"],
            center: ["text-center"],
            right: ["text-right"],
        },
        size: {
            xxs: ["text-xxs", "tracking-snug"],
            xs: ["text-xs", "tracking-snug"],
            "13": ["text-[13px]", "tracking-snug"],
            sm: ["text-sm", "tracking-snug"],
            base: ["text-base", "tracking-snug"],
            lg: ["text-base", "tracking-snug"],
            xl: ["text-lg", "tracking-snug"],
            "2xl": ["text-xl", "tracking-snug"],
            "3xl": ["text-2xl", "tracking-snug"],
            "4xl": ["text-3xl", "tracking-snug"],
            "5xl": ["text-4xl", "tracking-snug"],
            "6xl": ["text-5xl", "tracking-snug"],
            "7xl": ["text-6xl", "tracking-snug"],
            "8xl": ["text-7xl", "tracking-snug"],
            "9xl": ["text-8xl", "tracking-snug"],
            inherit: ["text-inherit"],
        },
        leading: {
            none: ["leading-none"],
            sm: ["leading-5"],
            base: ["leading-6"], // 24px
            lg: ["leading-8"], // 32px
            normal: ["leading-normal"],
        },
        weight: {
            light: ["font-light"],
            regular: ["font-normal"],
            medium: ["font-medium"],
            semibold: ["font-semibold"],
            bold: ["font-bold"],
            extraBold: ["font-extrabold"],
        },
        truncate: {
            true: ["truncate", "flex-grow", "basis-0"],
            false: [],
        },

        variant: {
            primary: ["text-appBlack"],
            primary2: ["text-primary"],
            secondary: ["text-(--color-appBlackLight)"],
            ghost: ["text-(--color-ghost)"],
            black: ["text-black"],
            gray: ["text-gray"],
            link: ["text-primary"],
            white: ["text-white"],
            inherit: "text-inherit",
        },
    },

    defaultVariants: {
        align: "left",
        variant: "secondary",
        size: "base",
        leading: "base",
    },
});

export interface TypographyProps<T extends ElementType = "p">
    extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof typography> {
    component?: T;
    children?: React.ReactNode;
}

function Typography<T extends ElementType = "p">({
    children,
    ...props
}: TypographyProps<T>) {
    const {
        align,
        className,
        leading,
        size,
        truncate,
        variant,
        weight,
        component,
        ...rest
    } = props;
    const ElementTag = component || "p";

    return (
        <ElementTag
            className={typography({
                align,
                leading,
                size,
                className,
                truncate,
                variant,
                weight,
            })}
            {...rest}
        >
            {children}
        </ElementTag>
    );
}

export default Typography;
