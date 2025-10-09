import { createFileRoute } from '@tanstack/react-router';
import ResetPassword from '../../pages/ResetPassword';

export const Route = createFileRoute('/auth/reset-password')({
    component: () => <ResetPassword />,
});
