/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */

import ProtectedLayout from "@/layouts/ProtectedLayout";

export const WithProtectionGuard = (LayoutComponent: React.ComponentType) => {
    return (props: any) => (
        <ProtectedLayout>
            <LayoutComponent {...props} />
        </ProtectedLayout>
    );
};
