// pages/Home.tsx
import { useQuery } from '@apollo/client';
import { Get_DashboardData } from '../../graphQl/queries/dashboardData';

import DashboardMetrics from "../../components/dashboard/DashboardMetrics.tsx";
import MonthlyRidesChart from "../../components/dashboard/MonthlyRidesChart.tsx";
import PageMeta from "../../components/common/PageMeta";
import RecentRides from "../../components/dashboard/RecentRides.tsx";
import RecentUsers from "../../components/dashboard/RecentUsers.tsx";

export default function Home() {
    // Fetch all dashboard data with a single GraphQL query
    const { loading, error, data } = useQuery(Get_DashboardData);

    // Loading state
    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-2">Loading dashboard data...</p>
            </div>
        </div>
    );

    // Error handling
    if (error) return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> Unable to load data: {error.message}</span>
        </div>
    );

    // ✅ Log the received data for debugging
    console.log("Dashboard data:", data);

    // Extract needed data
    const { stats, ridesPerMonth, recentRides, recentUsers } = data.getDashboardData;
    console.log("Stats:", stats);
    console.log("Rides per month:", ridesPerMonth);

    return (
        <>
            <PageMeta
                title="Dashboard | Ridesharing Application"
                description="Main dashboard of the ridesharing application"
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-10">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 flex flex-col space-y-6">
                        {/* Pass stats to DashboardMetrics component */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md dark:shadow-lg dark:shadow-gray-700/20">
                            <DashboardMetrics stats={stats} />
                        </div>

                        {/* Pass rides per month data to MonthlyRidesChart component */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md dark:shadow-lg dark:shadow-gray-700/20">
                            <MonthlyRidesChart data={ridesPerMonth} />
                        </div>
                    </div>

                    <div className="col-span-12 mt-2">
                        {/* Pass recent rides data to RecentRides component */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md dark:shadow-lg dark:shadow-gray-700/20">
                            <RecentRides rides={recentRides} />
                        </div>
                    </div>
                    <div className="col-span-12 mt-2">
                        {/* Pass recent users data to RecentUsers component */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md dark:shadow-lg dark:shadow-gray-700/20">
                            <RecentUsers users={recentUsers} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}