import { Slot, Slottable } from "@radix-ui/react-slot";
import { ButtonHTMLAttributes, useMemo } from "react";
import { tv, VariantProps } from "tailwind-variants";
import Loader from "./Loader";
import IconLoader from "./IconLoader";


const baseStyles = [
    "group",
    "relative",
    "flex",
    "items-center",
    "justify-center",
    "font-inter",
    "font-bold",
    "tracking-[0.3px]",
    "cursor-pointer",
    "whitespace-nowrap",
    "gap-1",
    "transition-all",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-2",
    "disabled:cursor-not-allowed",
];

const button = tv({
    base: baseStyles,
    variants: {
        variant: {
            primary: [
                "border",
                "border-transparent",
                "rounded-lg",
                "text-white",
                "bg-gradient-to-r",
                "from-teal-500",
                "to-teal-600",
                "hover:from-teal-600",
                "hover:to-teal-700",
                "focus:ring-teal-500",
                "disabled:opacity-70",
            ],
            secondary: [
                "bg-secondary-100",
                "text-primary",
                "disabled:opacity-30",
            ],
            ghost: ["text-appBlackLight", "bg-transparent"],
            tertiary: [
                "text-primary",
                "bg-transparent",
                "border",
                "disabled:text-gray400",
                "disabled:border-gray400",
            ],
        },
        size: {
            xs: ["px-2", "py-2", "text-xs"],
            sm: ["py-3", "px-4", "text-sm"],
            md: ["py-4", "px-6", "text-base"],
            lg: ["py-5", "px-8", "text-lg"],
            xl: ["px-32", "py-6", "text-xl"],
        },
        width: {
            full: ["w-full"],
        },
        rounded: {
            xs: ["rounded-xs"],
            sm: ["rounded-sm"],
            md: ["rounded-md"],
            lg: ["rounded-lg"],
            "10": ["rounded-[10px]"],
            xl: ["rounded-xl"],
            full: ["rounded-full"],
        },
        standaloneIcon: {
            true: ["p-0", "!bg-transparent"],
            false: [],
        },
        leadingIcon: {
            true: [],
            false: [],
        },
    },
    compoundVariants: [
        {
            className: "w-8",
            size: "md",
            standaloneIcon: true,
        },
        {
            className: "pr-2",
            size: "md",
            leadingIcon: true,
        },
    ],
    defaultVariants: {
        variant: "primary",
        size: "sm",
        rounded: "md",
    },
});

type ButtonVariantProps = Omit<
    VariantProps<typeof button>,
    "standaloneIcon" | "leadingIcon"
>;

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {
    children?: React.ReactNode;
    className?: string;
    type?: "button" | "submit" | "reset" | undefined;
    standaloneIcon?: React.ReactNode;
    leadingIcon?: React.ReactNode;
    buttonText?: string;
    asChild?: boolean;
    loading?: boolean;
}

export default function Button({
    variant = "primary",
    children,
    size,
    type = "button",
    width,
    className,
    standaloneIcon,
    leadingIcon,
    rounded,
    buttonText,
    asChild,
    loading,
    ...props
}: ButtonProps) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            className={button({
                size,
                width,
                variant: !Boolean(standaloneIcon) ? variant : undefined, // eslint-disable-line no-extra-boolean-cast
                standaloneIcon: Boolean(standaloneIcon),
                leadingIcon: Boolean(leadingIcon) && !standaloneIcon,
                rounded,
            }) + (className ? ` ${className}` : "")}
            type={type}
            {...props}
        >
            {loading ? (
                <IconLoader />
            ) : (
                standaloneIcon || leadingIcon
            )}

            <Slottable>{buttonText ?? children}</Slottable>
        </Comp>
    );
}
