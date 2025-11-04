import Typography from "@/components/Typography"
import { Link } from "@tanstack/react-router"
import { ArrowUpRightIcon, BarChart3Icon, PieChartIcon, TrendingUpIcon } from "lucide-react"

export const QuickInsight = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 pb-3">
                <Typography
                    component="h2"
                    size="lg"
                    weight="bold"
                    className="text-gray-900"
                >
                    Quick Insights
                </Typography>
                <Typography size="sm" className="text-gray-500">
                    At a glance
                </Typography>
            </div>
            <div className="px-6 pb-6 space-y-4">
                <Link
                    to="/insights"
                    className="block p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg hover:from-indigo-100 hover:to-blue-100 transition-all"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center text-indigo-600">
                            <TrendingUpIcon size={18} className="mr-2" />
                            <Typography component="h3" weight="medium">
                                Spending Trends
                            </Typography>
                        </div>
                        <ArrowUpRightIcon size={14} className="text-indigo-600" />
                    </div>
                    <Typography size="sm" className="text-gray-600">
                        Your spending is 8% lower than last month
                    </Typography>
                </Link>
                <Link
                    to="/insights"
                    className="block p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg hover:from-emerald-100 hover:to-teal-100 transition-all"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center text-emerald-600">
                            <BarChart3Icon size={18} className="mr-2" />
                            <Typography component="h3" weight="medium">
                                Usage Analysis
                            </Typography>
                        </div>
                        <ArrowUpRightIcon size={14} className="text-emerald-600" />
                    </div>
                    <Typography size="sm" className="text-gray-600">
                        You could save $24.97 by optimizing plans
                    </Typography>
                </Link>
                <Link
                    to="/insights"
                    className="block p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg hover:from-amber-100 hover:to-orange-100 transition-all"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center text-amber-600">
                            <PieChartIcon size={18} className="mr-2" />
                            <Typography component="h3" weight="medium">
                                Subscription Mix
                            </Typography>
                        </div>
                        <ArrowUpRightIcon size={14} className="text-amber-600" />
                    </div>
                    <Typography size="sm" className="text-gray-600">
                        Entertainment makes up 42% of your spending
                    </Typography>
                </Link>
            </div>
        </div>
    )
}