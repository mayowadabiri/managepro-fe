import { createFileRoute } from '@tanstack/react-router';
import Insights from '../../pages/Insights';

export const Route = createFileRoute('/_layout/insights')({
    component: () => <Insights />,
});
