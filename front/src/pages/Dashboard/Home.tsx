// pages/Home.tsx
import { useQuery } from '@apollo/client';
import { Get_DashboardData } from '../../graphQl/queries/dashboardData';

import EcommerceMetrics from "../../components/dashboard/EcommerceMetrics";
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
            <div className="mt-6">
                <div className="grid grid-cols-12 gap-1 md:gap-1">
                    <div className="col-span-12 flex flex-col space-y-4">
                        {/* Pass stats to EcommerceMetrics component */}
                        <EcommerceMetrics stats={stats} />

                        {/* Pass rides per month data to MonthlyRidesChart component */}
                        <MonthlyRidesChart data={ridesPerMonth} />
                    </div>

                    <div className="col-span-12  mt-4">
                        {/* Pass recent rides data to RecentRides component */}
                        <RecentRides rides={recentRides} />
                    </div>
                    <div className="col-span-12 mt-4">
                        {/* Pass recent users data to RecentUsers component */}
                        <RecentUsers users={recentUsers} />
                    </div>
                </div>
            </div>
        </>
    );
}
