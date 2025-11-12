// components/SubscriptionTable.tsx
import React, { useMemo } from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    SortingState
} from '@tanstack/react-table';
import { Edit as EditIcon, Trash2 as Trash2Icon, ArrowUp as ArrowUpIcon, ArrowDown as ArrowDownIcon } from 'lucide-react';
import { getReadableStatus, type Subscription } from '../types';
import { formatDate, formatPrice } from '../utils/format';

type Props = {
    data: Subscription[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onRowClick: (id: number) => void;
    sorting: SortingState;
    setSorting: (s: SortingState) => void;
};

const columnHelper = createColumnHelper<Subscription>();

export function makeColumns() {
    return [
        columnHelper.accessor((row) => row, {
            id: 'subscription',
            header: () => 'Subscription',
            cell: ({ getValue }) => {
                const sub = getValue();
                const name = sub.service?.name ?? sub.category?.name ?? 'Subscription';
                const logo = sub.service?.imageUrl;
                return (
                    <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                            {logo ? <img src={logo} alt={name} className="h-8 w-8 object-contain" onError={(e) => {
                                (e.currentTarget as HTMLImageElement).onerror = null;
                                (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
                            }} /> : <div className="text-sm text-gray-500">{name[0]}</div>}
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{name}</div>
                            <div className="text-sm text-gray-500 md:hidden">{sub.category?.name}</div>
                            <div className="text-sm text-gray-500 hidden md:block">Started {formatDate(sub.startDate)}</div>
                        </div>
                    </div>
                );
            },
            enableSorting: false,
        }),

        columnHelper.accessor('category', {
            id: 'category',
            header: 'Category',
            cell: info => <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{info.getValue()?.name ?? '—'}</span>,
        }),

        columnHelper.accessor(row => row.amount, {
            id: 'price',
            header: () => 'Price',
            cell: info => <div className="text-sm font-medium text-gray-900">{formatPrice(info.getValue(), info.row.original.currency, info.row.original.billingCycle)}</div>,
            enableSorting: true
        }),

        columnHelper.accessor((row) => row, {
            id: 'status',
            header: 'Status',
            cell: ({ getValue }) => {
                const sub = getValue();
                const status = getReadableStatus(sub.status);
                const daysLeft = sub.daysLeft
                return (
                    <div className="flex flex-col">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center w-fit ${status.bgColor} ${status.textColor}`}>
                            {status.label}
                        </span>
                        {daysLeft > 0 && status.label !== 'Cancelled' && <span className="text-xs text-gray-500 mt-1">{daysLeft === 1 ? '1 day left' : `${daysLeft} days left`}</span>}
                    </div>
                );
            }
        }),

        columnHelper.accessor('nextBillingDate', {
            id: 'nextBillingDate',
            header: 'Next Billing',
            cell: info => <div className="text-sm text-gray-900">{formatDate(info.getValue())}</div>,
            enableSorting: true
        }),

        columnHelper.accessor((row) => row.id, {
            id: 'actions',
            header: 'Actions',
            cell: ({ getValue, row }) => {
                return (
                    <div className="flex justify-end space-x-3">
                        <button onClick={(e) => { e.stopPropagation(); row.original && (row.original as Subscription) && (row.original as Subscription).id && (row.original as Subscription).id; }} className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" aria-label="Edit">
                            <EditIcon size={16} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); }} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors" aria-label="Delete">
                            <Trash2Icon size={16} />
                        </button>
                    </div>
                );
            },
            enableSorting: false
        })
    ];
}

export default function SubscriptionTable({ data, onEdit, onDelete, onRowClick, sorting, setSorting }: Props) {
    // create columns with factory
    const columns = useMemo(() => makeColumns(), []);

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel()
    });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                    <div className="flex items-center" onClick={() => header.column.getToggleSortingHandler && header.column.getToggleSortingHandler()}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {{
                                            asc: <ArrowUpIcon size={14} className="ml-1" />,
                                            desc: <ArrowDownIcon size={14} className="ml-1" />,
                                        }[header.column.getIsSorted() as string] ?? null}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onRowClick(row.original.id)}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
