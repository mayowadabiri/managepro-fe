import * as React from "react";
import * as Form from "@radix-ui/react-form";
import { tv } from "tailwind-variants";
import { cn } from "../utils/helpers";

// Root container
const root = tv({
    base: [
        "flex", "flex-col", "relative", "items-start",
        "[&>div>input:disabled]:cursor-not-allowed",
        "[&>div>textarea:disabled]:cursor-not-allowed",
        "[&>div>input]:font-inter",
        "[&>div>textarea]:font-inter",
    ],
    variants: {
        size: {
            base: [
                "gap-2", "[&>label]:text-sm", "[&>div>input]:pr-2.5", "[&>div>input]:py-3", "[&>div>input]:rounded-lg", "[&>div>input]:text-sm", "[&>div>textarea]:pl-3", "[&>div>textarea]:pr-3", "[&>div>textarea]:py-2.5", "[&>div>textarea]:rounded-lg", "[&>div>textarea]:text-sm", "[&>div>textarea]:leading-normal", "[&>svg]:h-4.5", "[&>svg]:w-4.5",
            ],
        },
        variant: {
            base: [
                "[&>div>input]:ring-0", "[&>div>input]:border-transparent", "[&>div>input]:placeholder-gray200", "focus:[&>div>input]:outline-none", "focus-visible:[&>div>input]:outline-0", "focus-visible:[&>div>input]:ring-0", "focus-visible:[&>div>input]:border-transparent", "[&>div>textarea]:ring-0", "[&>div>textarea]:border-transparent", "[&>div>textarea]:placeholder-[#858D9D]", "focus:[&>div>textarea]:outline-none",
            ],
            primary: [
                "[&>div>input]:shadow-input--resting", "[&>div>input]:text-gray800", "[&>div>input]:border-gray300", "[&>div>textarea]:shadow-input--resting", "[&>div>textarea]:text-[#858D9D]", "[&>div>textarea]:border-gray300", "[&>div>textarea]:hover:border-gray-600/40", "[&>div>textarea]:placeholder-[#858D9D]", "focus:[&>div>input]:outline-none", "focus-visible:[&>div>input]:outline-none", "focus:[&>div>input]:ring-0", "focus:[&>div>textarea]:outline-none", "focus:[&>div>textarea]:ring-0", "[&>div>input:disabled]:pointer-events-none", "[&>div>input:disabled]:opacity-50", "[&>div>input:disabled]:bg-gray200", "[&>div>textarea:disabled]:pointer-events-none", "[&>div>textarea:disabled]:hover:border-gray200",
            ],
        },
        leadingIcon: { true: [], false: [] },
        trailingIcon: { true: [], false: [] },
        width: {
            full: ["w-full", "[&>div]:w-full", "[&>div>input]:w-full", "[&>div>textarea]:w-full"],
        },
    },
    compoundVariants: [
        {
            size: "base",
            leadingIcon: true,
            className: ["[&>svg]:left-2", "[&>div>input]:pl-8", "[&>div>textarea]:pl-8"],
        },
        {
            size: "base",
            trailingIcon: true,
            className: ["[&>svg]:right-2", "[&>div>input]:pr-8", "[&>div>textarea]:pr-8"],
        },
    ],
    defaultVariants: {
        size: "base",
        variant: "primary",
    },
});

// Input field style
const field = tv({
    base: [
        "appearance-none", "bg-transparent", "block", "box-border", "flex-1", "no-underline", "w-full", "border", "select-none", "focus-visible:outline-none", "font-normal", "text-ellipsis", "tracking-normal", "text-base", "duration-300", "ease-smooth", "transition-combined",
    ],
});


// Label subcomponent using Radix Form.Label
const Label = React.forwardRef<
    HTMLLabelElement,
    React.ComponentPropsWithoutRef<typeof Form.Label> & { required?: boolean }
>((props, ref) => {
    const { children, required, className, ...rest } = props;
    return (
        <Form.Label
            ref={ref}
            className={cn("block text-sm font-medium text-gray-700 mb-1", className)}
            {...rest}
        >
            {children}
            {required && <span className="font-bold text-[#FB0808]">*</span>}
        </Form.Label>
    );
});
Label.displayName = "RadixInputLabel";

// Error subcomponent using Radix Form.Message
const Error = React.forwardRef<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<typeof Form.Message>
>((props, ref) => {
    const { children, className, ...rest } = props;
    return (
        <Form.Message ref={ref} className={cn("text-xs text-red-600 mt-1", className)} {...rest}>
            {children}
        </Form.Message>
    );
});
Error.displayName = "RadixInputError";

// Info subcomponent using Radix Form.ValidityState
const Info = (
    props: React.ComponentPropsWithoutRef<typeof Form.ValidityState>
) => {
    return (
        <span className="text-xs text-gray-500 mt-1">
            <Form.ValidityState {...props} />
        </span>
    );
};
Info.displayName = "RadixInputInfo";


// FormControl subcomponent for Form.Control + input

const inputBaseClass = "appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition-all";

const FormControl = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & {
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
    className?: string;
}>(
    ({ leadingIcon, trailingIcon, className, name, ...props }, ref) => (
        <div className={cn("w-full relative align-middle")}>
            {leadingIcon && (
                <div className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-sm text-gray-950 opacity-50">
                    {leadingIcon}
                </div>
            )}
            <Form.Control asChild>
                <input
                    ref={ref}
                    className={cn(
                        inputBaseClass,
                        leadingIcon ? "mt-1 pl-8" : "",
                        className
                    )}
                    name={name}
                    {...props}
                />
            </Form.Control>
            {trailingIcon && (
                <div className="absolute top-1/2 right-3 z-10 flex -translate-y-1/2 items-center text-sm text-gray-950 opacity-50">
                    {trailingIcon}
                </div>
            )}
        </div>
    )
);
FormControl.displayName = "RadixInputFormControl";


// Field subcomponent: just a wrapper for Form.Field, children are passed in
const Field = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Form.Field>>(
    ({ children, name, className, ...props }, ref) => (
        <Form.Field ref={ref} name={name!} className={cn("w-full", className)} {...props}>
            {children}
        </Form.Field>
    )
);
Field.displayName = "RadixInputField";

// Root subcomponent using Radix Form.Root
const Root = React.forwardRef<HTMLFormElement, React.ComponentPropsWithoutRef<typeof Form.Root> & {
    classNames?: string;
    leadingIcon?: boolean;
    trailingIcon?: boolean;
}>(
    ({ className, classNames, leadingIcon, trailingIcon, ...props }, ref) => (
        <Form.Root
            ref={ref}
            className={root({
                leadingIcon: !!leadingIcon,
                trailingIcon: !!trailingIcon,
                className: cn(className, classNames),
            })}
            {...props}
        />
    )
);
Root.displayName = "RadixInputRoot";

// Main RadixInput composition
// export const RadixInput = React.forwardRef<HTMLInputElement, RadixInputProps>(
//     (
//         {
//             label,
//             errorText,
//             hasError,
//             classNames,
//             leadingIcon,
//             trailingIcon,
//             ...props
//         },
//         ref
//     ) => (
//         <Root classNames={classNames} leadingIcon={!!leadingIcon} trailingIcon={!!trailingIcon}>
//             {label && <Label htmlFor={props.id} required={props.required}>{label}</Label>}
//             <Field ref={ref} leadingIcon={leadingIcon} trailingIcon={trailingIcon} {...props} />
//             {hasError && errorText && <Error>{errorText}</Error>}
//         </Root>
//     )
// );
// RadixInput.displayName = "RadixInput";

export { Root, Field, Label, Error, Info, FormControl as Control };
