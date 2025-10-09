import { createFileRoute } from '@tanstack/react-router';
import Subscriptions from '../../pages/Subscriptions';

export const Route = createFileRoute('/_layout/subscriptions')({
    component: () => <Subscriptions />,
});
