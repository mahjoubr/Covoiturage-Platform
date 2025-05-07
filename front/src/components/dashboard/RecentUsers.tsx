import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { User } from "../../types.tsx";
import { Mail, UserIcon } from "lucide-react";

interface Props {
    users: User[];
}

// New Default image URL (working placeholder)
const DEFAULT_IMAGE = "https://ui-avatars.com/api/?name=User&background=random&color=fff";

export default function RecentUsers({ users }: Props) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 shadow-sm">
            <div className="flex flex-col gap-2 mb-5 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Recent Users
                </h3>
                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-gray-500 dark:text-gray-400">
                    Showing latest 5 users
                </span>
            </div>

            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-gray-100 dark:border-gray-800 border-b">
                        <TableRow>
                            <TableCell isHeader className="py-3 text-theme-xs font-medium text-start text-gray-500 dark:text-gray-400">
                                Avatar
                            </TableCell>
                            <TableCell isHeader className="py-3 text-theme-xs font-medium text-start text-gray-500 dark:text-gray-400">
                                First Name
                            </TableCell>
                            <TableCell isHeader className="py-3 text-theme-xs font-medium text-start text-gray-500 dark:text-gray-400">
                                Last Name
                            </TableCell>
                            <TableCell isHeader className="py-3 text-theme-xs font-medium text-start text-gray-500 dark:text-gray-400">
                                Email
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {users.slice(0, 5).map((user, index) => (
                            <TableRow
                                key={index}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                            >
                                <TableCell className="py-4">
                                    <div className="relative">
                                        <img
                                            src={user.imageUrl?.trim() ? user.imageUrl : DEFAULT_IMAGE}
                                            alt={`${user.name} ${user.lastName}`}
                                            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                        />
                                        {!user.imageUrl?.trim() && (
                                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gray-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-theme-sm font-medium text-gray-800 dark:text-white/90">
                                    <div className="flex items-center gap-1.5">
                                        <UserIcon size={14} className="text-gray-400" />
                                        <span>{user.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-theme-sm text-gray-800 dark:text-white/90">
                                    {user.lastName}
                                </TableCell>
                                <TableCell className="py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1.5">
                                        <Mail size={14} className="text-gray-400" />
                                        <span>{user.email}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}