import Calendar from "@/components/Calendar";
import Typography from "@/components/Typography";
import { Link } from "@tanstack/react-router";
import { formatDate } from "date-fns";
import { ArrowUpRightIcon, CalendarIcon, PlusIcon } from "lucide-react";

export const ExpiringSoon = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
                <div className="p-6 pb-3 flex justify-between items-center">
                    <div>
                        <Typography
                            component="h2"
                            size="lg"
                            weight="bold"
                            className="text-gray-900"
                        >
                            Expiring Soon
                        </Typography>
                        <Typography size="sm" className="text-gray-500">
                            Subscriptions renewing in the next 14 days
                        </Typography>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            type="button"
                            // onClick={() => setShowAddForm(true)}
                            className="flex items-center px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 text-sm font-medium transition-colors"
                        >
                            <PlusIcon size={16} className="mr-2" />
                            Add Subscription
                        </button>
                        <Link
                            to="/subscriptions"
                            className="text-teal-600 hover:text-teal-800 text-sm font-medium flex items-center"
                        >
                            View all <ArrowUpRightIcon size={14} className="ml-1" />
                        </Link>
                    </div>
                </div>
                <div className="px-6 pb-6">
                    {[].length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {[].map((subscription: any) => {
                                //   const daysLeft = getDaysUntil(subscription.nextBillingDate);
                                return (
                                    <div
                                        key={subscription.id}
                                        className="py-4 flex items-center justify-between hover:bg-gray-50 rounded-lg px-3 -mx-3 cursor-pointer transition-colors"
                                    //   onClick={() => handleSubscriptionClick(subscription.id)}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={subscription.logo}
                                                    alt={subscription.name}
                                                    className="w-10 h-10 object-contain"
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${subscription.name}&background=random&color=fff&size=128`;
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">
                                                    {subscription.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {subscription.category}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="font-semibold text-gray-900">
                                                ${subscription.price.toFixed(2)}
                                                <span className="text-sm text-gray-500 font-normal ml-1">
                                                    /{subscription.billingCycle.slice(0, 2)}
                                                </span>
                                            </div>
                                            <div className="flex items-center mt-1">
                                                <div
                                                    className={`h-2 w-2 rounded-full mr-2 ${3 <= 3 ? "bg-red-500" : 3 <= 7 ? "bg-amber-500" : "bg-emerald-500"}`}
                                                ></div>
                                                {/* <span className="text-sm text-gray-500">
                            {daysLeft === 0
                              ? "Today"
                              : daysLeft === 1
                                ? "Tomorrow"
                                : `${daysLeft} days`}
                            {" - "}
                            {formatDate(subscription.nextBillingDate)}
                          </span> */}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                                <CalendarIcon size={24} />
                            </div>
                            <Typography className="text-gray-600" weight="medium">
                                No upcoming renewals
                            </Typography>
                            <Typography size="sm" className="text-gray-500 mt-1">
                                You're all set for the next 14 days
                            </Typography>
                            <button
                                type="button"
                                //   onClick={() => setShowAddForm(true)}
                                className="mt-4 flex items-center px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 text-sm font-medium transition-colors mx-auto"
                            >
                                <PlusIcon size={16} className="mr-2" />
                                Add Subscription
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {/* Calendar Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 pb-3">
                    <Typography
                        component="h2"
                        size="lg"
                        weight="bold"
                        className="text-gray-900"
                    >
                        Payment Calendar
                    </Typography>
                    <Typography size="sm" className="text-gray-500">
                        Your upcoming subscription renewals
                    </Typography>
                </div>
                <div className="px-6 pb-6">
                    <Calendar
                    //   value={selectedDate}
                    //   onChange={handleDateSelect}
                    //   highlightedDates={renewalDates}
                    />
                    <div className="mt-4 flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <div className="h-3 w-3 bg-indigo-100 rounded-full mr-2"></div>
                            <Typography className="text-gray-600">Renewal date</Typography>
                        </div>
                        <div className="flex items-center">
                            <div className="h-3 w-3 border border-blue-500 rounded-full mr-2"></div>
                            <Typography className="text-gray-600">Today</Typography>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}