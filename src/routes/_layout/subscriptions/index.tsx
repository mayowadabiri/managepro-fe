import SubscriptionsPage from '@/pages/Subscriptions';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/subscriptions/')({
    component: () => <SubscriptionsPage />,
});
