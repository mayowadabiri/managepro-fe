import Typography from "@/components/Typography"
import { BellIcon, CreditCardIcon, DollarSignIcon } from "lucide-react"

export const HomeSummary = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 pb-0">
                <Typography
                    component="h1"
                    size="2xl"
                    weight="bold"
                    className="text-gray-900 mb-2"
                >
                    Welcome back
                </Typography>
                <Typography className="text-gray-500">
                    Here's an overview of your subscription spending
                </Typography>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                <div className="flex items-start space-x-4">
                    <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
                        <CreditCardIcon size={24} />
                    </div>
                    <div>
                        <Typography size="sm" weight="medium" className="text-gray-500">
                            Monthly Spending
                        </Typography>
                        <Typography
                            component="h3"
                            size="2xl"
                            weight="bold"
                            className="text-gray-900"
                        >
                            {/* ${totalMonthly.toFixed(2)} */}
                            $0
                        </Typography>
                        <Typography size="sm" className="text-gray-500 mt-1">
                            {/* Across {subs.length} subscriptions */}
                            Across 2 subscriptions
                        </Typography>
                    </div>
                </div>
                <div className="flex items-start space-x-4">
                    <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
                        <DollarSignIcon size={24} />
                    </div>
                    <div>
                        <Typography size="sm" weight="medium" className="text-gray-500">
                            Yearly Spending
                        </Typography>
                        <Typography
                            component="h3"
                            size="2xl"
                            weight="bold"
                            className="text-gray-900"
                        >
                            {/* ${totalYearly.toFixed(2)} */}
                            $0
                        </Typography>
                        <Typography size="sm" className="text-gray-500 mt-1">
                            Projected annual cost
                        </Typography>
                    </div>
                </div>
                <div className="flex items-start space-x-4">
                    <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
                        <BellIcon size={24} />
                    </div>
                    <div>
                        <Typography size="sm" weight="medium" className="text-gray-500">
                            Upcoming Renewals
                        </Typography>
                        <Typography
                            component="h3"
                            size="2xl"
                            weight="bold"
                            className="text-gray-900"
                        >
                            {/* {upcomingRenewals.length} */}
                            2
                        </Typography>
                        <Typography size="sm" className="text-gray-500 mt-1">
                            In the next 14 days
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    )
}