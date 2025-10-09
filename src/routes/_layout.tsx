
import { WithProtectionGuard } from "@/hoc/WithProtectionGuard.hoc";
import DashboardLayout from "@/layouts/DashboardLayout";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/_layout")({
    component: WithProtectionGuard(DashboardLayout)
});
