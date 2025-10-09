import * as React from "react";
import {
    unstable_OneTimePasswordField as OneTimePasswordField,
} from "radix-ui";

const OnetimePasswordField = (
    props: OneTimePasswordField.OneTimePasswordFieldProps
) => (
    <OneTimePasswordField.Root
        {...props}
        className="flex justify-between gap-2"
    >
        {Array.from({ length: 6 }).map((_, i) => (
            <OneTimePasswordField.Input
                key={i}
                index={i}
                className="flex h-12 w-12 items-center justify-center rounded-md border border-teal-900 text-lg font-mono text-center text-black outline-none
                   focus:border-teal-500 focus:ring-2 focus:ring-teal-900"
            />
        ))}

        {/* Hidden input must be inside Root */}
        <OneTimePasswordField.HiddenInput />
    </OneTimePasswordField.Root>
);

export default OnetimePasswordField;
