import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";

interface Props {
    rides: {
        id: string;
        departure: string;
        arrival: string;
        date: string;
        time: string;
        price: number;
        nbPassengers: number;
        state: string;
    }[];
}

export default function RecentRides({ rides }: Props) {
    // Format price with currency
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 shadow-sm">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Recent Rides
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    Showing latest 5 rides
                </span>
            </div>

            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                        <TableRow>
                            <TableCell isHeader className="py-3 text-theme-xs font-medium text-start text-gray-500 dark:text-gray-400">
                                From
                            </TableCell>
                            <TableCell isHeader className="py-3 text-theme-xs font-medium text-start text-gray-500 dark:text-gray-400">
                                To
                            </TableCell>
                            <TableCell isHeader className="py-3 text-theme-xs font-medium text-start text-gray-500 dark:text-gray-400">
                                Date
                            </TableCell>
                            <TableCell isHeader className="py-3 text-theme-xs font-medium text-start text-gray-500 dark:text-gray-400">
                                Time
                            </TableCell>
                            <TableCell isHeader className="py-3 text-theme-xs font-medium text-start text-gray-500 dark:text-gray-400">
                                Price
                            </TableCell>
                            <TableCell isHeader className="py-3 text-theme-xs font-medium text-start text-gray-500 dark:text-gray-400">
                                Status
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {rides.slice(0, 5).map((ride, index) => (
                            <TableRow
                                key={index}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                            >
                                <TableCell className="py-4 text-theme-sm font-medium text-gray-800 dark:text-white/90">
                                    {ride.departure}
                                </TableCell>
                                <TableCell className="py-4 text-theme-sm text-gray-800 dark:text-white/90">
                                    <div className="flex items-center gap-1">
                                        <ArrowRight size={14} className="text-gray-400" />
                                        <span>{ride.arrival}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1.5">
                                        <CalendarDays size={14} className="text-gray-400" />
                                        <span>{ride.date}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} className="text-gray-400" />
                                        <span>{ride.time}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-theme-sm font-medium text-gray-700 dark:text-gray-300">
                                    {formatPrice(ride.price)}
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge
                                        size="sm"
                                        variant="light"
                                        color={
                                            ride.state === "Not Started"
                                                ? "warning"
                                                : ride.state === "Started"
                                                    ? "success"
                                                    : ride.state === "Closed"
                                                        ? "warning"
                                                        : "error"
                                        }
                                    >
                                        {ride.state}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}