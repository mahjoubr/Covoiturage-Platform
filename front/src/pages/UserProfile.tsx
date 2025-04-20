import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserHistoryCard from "../components/UserProfile/UserHistoryCard";
import PageMeta from "../components/common/PageMeta";
import { Ride } from "../types";

const rides: Ride[] = [
  {
    from: "United States",
    to: "Phoenix, Arizona, United States",
    date: "12/02/2024 17:00h",
    riders: ["Maram ben Rhouma", "John Doe"],
  },
  {
    from: "Canada",
    to: "Toronto, Ontario",
    date: "14/03/2024 09:30h",
    riders: ["Alice Johnson", "Bob Smith"],
  },
  {
    from: "Mexico",
    to: "Mexico City",
    date: "15/04/2024 14:00h",
    riders: ["Carlos Lopez"],
  },
];
const UserProfiles= () => {  return (
    <>
      <PageMeta
        title="Profile"
        description=""
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        
        <div className="space-y-6">
          <UserMetaCard isEditable={false} />
          <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          History
          </h2>
          {rides.map((ride, index) => (
        <UserHistoryCard key={index} ride={ride} />
      ))}
        </div>
      </div>
    </>
  );
}
export default UserProfiles;