import React from "react";
import { Services } from "@/types";
import { Plus as PlusIcon } from "lucide-react";

interface DropdownProps {
    filteredServices: Services[];
    handleServiceSelect: (service: Services) => void;
    onAddCustom?: () => void;
    className?: string;
}

export const ServiceDropdown: React.FC<DropdownProps> = ({
    filteredServices,
    handleServiceSelect,
    onAddCustom,
    className = "",
}) => {
    return (
        <div className={`w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto ${className}`}>
            <div className="p-2 border-b border-gray-100">
                <button
                    type="button"
                    onClick={() => onAddCustom && onAddCustom()}
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 flex items-center text-indigo-600 font-medium"
                >
                    <PlusIcon size={16} className="mr-2" />
                    Add custom subscription
                </button>
            </div>

            <ul>
                {filteredServices.length > 0 ? (
                    filteredServices.map((service: Services) => (
                        <li key={service.name} className="px-2">
                            <button
                                type="button"
                                onClick={() => handleServiceSelect(service)}
                                className="w-full text-left px-2 py-2 flex items-center space-x-3 rounded-md hover:bg-gray-50"
                            >
                                <div className="h-8 w-8 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden p-1">
                                    {service.imageUrl ? (
                                        <img
                                            src={service.imageUrl}
                                            alt={service.name}
                                            className="h-full w-full object-contain"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-gray-100" />
                                    )}
                                </div>
                                <span className="text-sm font-medium text-gray-900">{service.name}</span>
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="px-4 py-3 text-sm text-gray-500">
                        No services found. Use "Add custom subscription" option.
                    </li>
                )}
            </ul>
        </div>
    );
};

export default ServiceDropdown;
