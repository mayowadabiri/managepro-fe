import { createFileRoute, redirect } from '@tanstack/react-router';
import OTPVerification from '../../pages/OTPVerification';

export const Route = createFileRoute('/auth/otp-verification')({
    component: () => <OTPVerification />,
    beforeLoad: async ({ location }) => {
        if (!location.state?.email) {
            throw redirect({
                to: '/auth/signup',
            });
        }
        return location;
    },
});