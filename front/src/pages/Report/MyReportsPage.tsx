import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_MY_REPORTS } from '../../graphQl/queries/myReports.ts';
import {
    AlertCircle,
    CheckCircle,
    Clock,
    FileText,
    Filter,
    Search,
} from 'lucide-react';
import {ReportCardSkeleton} from "../../components/report/ReportCardSkaleton.tsx";
import {EmptyState} from "../../components/report/EmptyState.tsx";
import {ReportCard} from "../../components/report/ReportCard.tsx";
import { Report } from '../../types/report.ts';

// Define the GraphQL query result type
interface MyReportsData {
    getMyReports: Report[];
}

const MyReportsPage: React.FC = () => {
    const { data, loading, error } = useQuery<MyReportsData>(GET_MY_REPORTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    // Check if reports exist and have data
    const hasReports = Array.isArray(data?.getMyReports) && data.getMyReports.length > 0;

    // Filter reports based on search query and status filter
    const getFilteredReports = () => {
        const reports = data?.getMyReports || [];

        return reports.filter(report => {
            const matchesSearch = searchQuery === '' ||
                report.subjectType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                report.reason.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === null || report.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    };

    const filteredReports = getFilteredReports();

    // Generate stats summary
    const getTotalsByStatus = () => {
        if (!data?.getMyReports) return { total: 0, pending: 0, accepted: 0, rejected: 0 };

        const reports = data.getMyReports || [];
        return {
            total: reports.length,
            pending: reports.filter(r => r.status === 'PENDING').length,
            accepted: reports.filter(r => r.status === 'ACCEPTED').length,
            rejected: reports.filter(r => r.status === 'REJECTED').length
        };
    };

    const stats = getTotalsByStatus();

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">


            <div className="max-w-7xl mx-auto relative">
                {/* Improved Page Header */}
                <div className="mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                        {/* Header content with breadcrumb and title */}
                        <div className="px-6 py-5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Reports</h1>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        Track and manage all your  reports
                                    </p>
                                </div>


                            </div>
                        </div>

                    </div>
                </div>


                {/* Search and Filter Controls */}
                {!loading && !error && hasReports && (

                    <div className="flex flex-col items-center gap-4 mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-90">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 md:w-[100%]">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 relative group hover:scale-[1.02] transition-transform">
                                <div className="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 rounded-xl transition-opacity"></div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/60 shadow-inner">
                                        <FileText className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Total Reports</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 border-l-4 border-l-amber-400 dark:border-l-amber-500 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 relative group hover:scale-[1.02] transition-transform">
                                <div className="absolute inset-0 bg-amber-500 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 rounded-xl transition-opacity"></div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/60 shadow-inner">
                                        <Clock className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Pending</p>
                                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.pending}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 border-l-4 border-l-emerald-400 dark:border-l-emerald-500 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 relative group hover:scale-[1.02] transition-transform">
                                <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 rounded-xl transition-opacity"></div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/60 shadow-inner">
                                        <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Approved</p>
                                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.accepted}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 border-l-4 border-l-rose-400 dark:border-l-rose-500 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 relative group hover:scale-[1.02] transition-transform">
                                <div className="absolute inset-0 bg-rose-500 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 rounded-xl transition-opacity"></div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-900/60 shadow-inner">
                                        <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Declined</p>
                                        <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{stats.rejected}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Search box - centered with 70% width */}
                        <div className="relative w-full md:w-[70%]">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent"
                                placeholder="Search reports..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Buttons container - centered */}
                        <div className="flex justify-center gap-2 overflow-x-auto">
                            <button
                                onClick={() => setStatusFilter(null)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                                    statusFilter === null
                                        ? 'bg-purple-600 text-white dark:bg-purple-500 shadow-sm'
                                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50'
                                }`}
                            >
                                All Reports
                            </button>
                            <button
                                onClick={() => setStatusFilter('PENDING')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                                    statusFilter === 'PENDING'
                                        ? 'bg-amber-600 text-white dark:bg-amber-700 shadow-sm'
                                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50'
                                }`}
                            >
                                <Clock className="w-4 h-4" />
                                Pending
                            </button>
                            <button
                                onClick={() => setStatusFilter('ACCEPTED')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                                    statusFilter === 'ACCEPTED'
                                        ? 'bg-emerald-600 text-white dark:bg-emerald-700 shadow-sm'
                                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50'
                                }`}
                            >
                                <CheckCircle className="w-4 h-4" />
                                Approved
                            </button>
                            <button
                                onClick={() => setStatusFilter('REJECTED')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                                    statusFilter === 'REJECTED'
                                        ? 'bg-rose-600 text-white dark:bg-rose-700 shadow-sm'
                                        : 'bg-rose-50 text-rose-800 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/50'
                                }`}
                            >
                                <AlertCircle className="w-4 h-4" />
                                Declined
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="ml-auto h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <ReportCardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-red-200 dark:border-red-800 overflow-hidden mb-6">
                        <div className="h-2 bg-red-500 dark:bg-red-600 w-full"></div>
                        <div className="p-6 flex items-start gap-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-800 dark:text-red-300 text-lg">Unable to load your reports</h3>
                                <p className="text-red-600 dark:text-red-400 mt-1">{error?.message}</p>
                                <button className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-200 rounded-lg text-sm font-medium transition-colors">
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reports List */}
                {!loading && !error && (
                    <>
                        {data?.getMyReports?.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <>
                                {filteredReports.length === 0 ? (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
                                        <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                                            <Filter className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No matching reports</h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Try adjusting your search or filter to find what you're looking for.
                                        </p>
                                        <button
                                            onClick={() => {setSearchQuery(''); setStatusFilter(null);}}
                                            className="mt-4 px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-300 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {filteredReports.map((report: Report) => (
                                            <ReportCard key={report.id} report={report} />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyReportsPage;