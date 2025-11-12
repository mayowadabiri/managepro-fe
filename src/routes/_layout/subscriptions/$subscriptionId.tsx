import SubscriptionDetails from '@/pages/SubscriptionDetails';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/subscriptions/$subscriptionId')({
    component: () => <SubscriptionDetails />,
});
