import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import PageMeta from "../components/common/PageMeta";
import { Drive, Review, Ride } from "../types";
import UserDriveCard from "../components/UserProfile/UserDriveCard";
import UserRideCard from "../components/UserProfile/UserRideCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import ReviewCarousel from "../components/UserProfile/ReviewCarousel";


const drives: Drive[] = [
  {
    from: "United States",
    to: "Phoenix",
    date: "12/02/2024 17:00h",
    riders: ["Maram ben Rhouma", "John Doe"],
  },
  {
    from: "Canada",
    to: "Toronto, Ontario",
    date: "14/03/2024 09:30h",
    riders: ["Alice Johnson", "Bob Smith"],
  },
 
];
const rides: Ride[] = [
  
  {
    from: "Canada",
    to: "Toronto, Ontario",
    date: "14/03/2024 09:30h",
    driver: "Alice Johnson",
  },
  {
    from: "Mexico",
    to: "Mexico City",
    date: "15/04/2024 14:00h",
    driver: "Carlos Lopez",
  },
];
const reviews: Review[] = [
  {
    id: 1,
    reviewer: { id: 1, username: 'John Doe' },
    stars: 5,
    comment: 'Excellent product! Would definitely recommend.',
    date: '2024-03-15',
    reviewedUser: {
      id: 0,
      username: ""
    }
  },
  {
    id: 1,
    reviewer: { id: 1, username: 'John Doe' },
    stars: 4,
    comment: 'Excellent product! Would definitely recommend.',
    date: '2024-03-15',
    reviewedUser: {
      id: 0,
      username: ""
    }
  },
    {
      id: 1,
      reviewer: { id: 1, username: 'John Doe' },
      stars: 3,
      comment: 'Excellent product! Would definitely recommend.',
      date: '2024-03-15',
      reviewedUser: {
        id: 0,
        username: ""
      }
    },]
const UserProfiles= () => {  return (
    <>
      <PageMeta
        title="Profile"
        description=""
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        
        <div className="space-y-6">
          <UserMetaCard isReportable={false} />
          <UserInfoCard isEditable={true} />
          <div className="container flex gap-6">
  <div className="w-1/2">
          <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          History as a driver
          </h2>
          {drives.map((drive, index) => (
        <UserDriveCard key={index} drive={drive} />
      ))}
        <div style={{justifySelf: "center"}}>
        <button className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
            view more
        </button>
        </div>
        
      </div>
      <div className="w-1/2">
      <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          History as a rider
      </h2>         
      {rides.map((ride, index) => (
        <UserRideCard key={index} ride={ride} />
      ))}
        <div style={{justifySelf: "center"}}>
        <button className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
            view more
        </button>
        </div>

      </div>
      </div>
            <ReviewCarousel reviews={reviews} />
      
          
        </div>
      </div>
    </>
  );
}
export default UserProfiles;