import Typography from "@/components/Typography";
import { formatDate } from "date-fns";
import { ArrowUpRightIcon, Link } from "lucide-react";

export const RecentActivities = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 pb-3 flex justify-between items-center">
                <div>
                    <Typography
                        component="h2"
                        size="lg"
                        weight="bold"
                        className="text-gray-900"
                    >
                        Recent Subscriptions
                    </Typography>
                    <Typography size="sm" className="text-gray-500">
                        Your active subscriptions
                    </Typography>
                </div>
                <Link
                    to="/subscriptions"
                    className="text-teal-600 hover:text-teal-800 text-sm font-medium flex items-center"
                >
                    View all <ArrowUpRightIcon size={14} className="ml-1" />
                </Link>
            </div>
            <div className="px-6 pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[].slice(0, 6).map((subscription: any) => (
                        <div
                            key={subscription.id}
                            className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 hover:shadow-sm cursor-pointer transition-all"
                        // onClick={() => handleSubscriptionClick(subscription.id)}
                        >
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={subscription.logo}
                                        alt={subscription.name}
                                        className="w-8 h-8 object-contain"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${subscription.name}&background=random&color=fff&size=128`;
                                        }}
                                    />
                                </div>
                                <div>
                                    <Typography
                                        component="h3"
                                        weight="medium"
                                        className="text-gray-900"
                                    >
                                        {subscription.name}
                                    </Typography>
                                    <Typography size="xs" className="text-gray-500">
                                        {subscription.category}
                                    </Typography>
                                </div>
                            </div>
                            <div className="flex justify-between items-end">
                                <Typography size="xs" className="text-gray-500">
                                    {/* Next billing: {formatDate(subscription.nextBillingDate)} */}
                                </Typography>
                                <Typography weight="semibold" className="text-gray-900">
                                    ${subscription.price.toFixed(2)}
                                    <span className="text-xs text-gray-500 font-normal ml-1">
                                        /{subscription.billingCycle.slice(0, 2)}
                                    </span>
                                </Typography>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}