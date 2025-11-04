import Typography from "@/components/Typography";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";


const COLORS = [
    "#4F46E5",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
];
export const CategoryBreakdown = () => {

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
            <div className="p-6 pb-3">
                <Typography
                    component="h2"
                    size="lg"
                    weight="bold"
                    className="text-gray-900"
                >
                    Category Breakdown
                </Typography>
                <Typography size="sm" className="text-gray-500">
                    Your monthly spending by category
                </Typography>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 px-6 pb-6">
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={[]}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {[].map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center space-y-3">
                    {[].map((cat, index) => {
                        const category = cat as { name: string; value: number };
                        return (
                            <div
                                key={category.name}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    <div
                                        className="w-3 h-3 rounded-sm mr-2"
                                        style={{
                                            backgroundColor: COLORS[index % COLORS.length],
                                        }}
                                    ></div>
                                    <Typography size="sm" weight="medium">
                                        {category.name}
                                    </Typography>
                                </div>
                                <Typography size="sm" weight="semibold">
                                    ${category.value.toFixed(2)}
                                </Typography>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}