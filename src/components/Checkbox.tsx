import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "../utils/helpers";

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
    label?: React.ReactNode;
    id: string;
    className?: string;
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
    ({ label, id, className, ...props }, ref) => (
        <div className="flex items-center gap-2">
            <CheckboxPrimitive.Root
                ref={ref}
                id={id}
                className={cn(
                    "peer h-4 w-4 shrink-0 rounded border border-gray-300 bg-white ring-offset-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                    className
                )}
                {...props}
            >
                <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
                    <CheckIcon className="h-3 w-3 text-teal-600" />
                </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
            {label && (
                <label htmlFor={id} className="text-sm text-gray-700 select-none cursor-pointer">
                    {label}
                </label>
            )}
        </div>
    )
);
Checkbox.displayName = "Checkbox";

export default Checkbox;
