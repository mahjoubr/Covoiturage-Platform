import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlyRidesChart from "../../components/ecommerce/MonthlyRidesChart.tsx";
import PageMeta from "../../components/common/PageMeta";
import RecentRides from "../../components/ecommerce/RecentRides.tsx";
import RecentUsers from "../../components/ecommerce/RecentUsers.tsx";

export default function Home() {
    return (
        <>
            <PageMeta
                title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
                description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <div className="mt-6">
                <div className="grid grid-cols-12 gap-1 md:gap-1">
                    <div className="col-span-12 flex flex-col space-y-4">
                        <EcommerceMetrics />

                        <MonthlyRidesChart />
                    </div>

                    <div className="col-span-12 xl:col-span-6 mt-4">
                        <RecentRides />
                    </div>
                    <div className="col-span-12 xl:col-span-6 mt-4">
                        <RecentUsers />
                    </div>

                </div>
            </div>
        </>
    );
}
