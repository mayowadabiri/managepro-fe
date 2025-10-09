import { createFileRoute } from '@tanstack/react-router';
import SubscriptionDetails from '../pages/SubscriptionDetails';

export const Route = createFileRoute('/_layout/subscription_$id')({
    component: () => <SubscriptionDetails />,
});
