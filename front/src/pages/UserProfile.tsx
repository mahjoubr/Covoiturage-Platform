import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import PageMeta from "../components/common/PageMeta";
import { Drive, Review, Ride } from "../types";
import UserDriveCard from "../components/UserProfile/UserDriveCard";
import UserRideCard from "../components/UserProfile/UserRideCard";
import ReviewCarousel from "../components/UserProfile/ReviewCarousel";

const drives: Drive[] = [
 
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
const rides: Ride[] = [
  {
    from: "United States",
    to: "Phoenix",
    date: "12/02/2024 17:00h",
    driver: "Maram ben Rhouma",
  },
  {
    from: "Canada",
    to: "Toronto, Ontario",
    date: "14/03/2024 09:30h",
    driver: "Alice Johnson",
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
          <UserMetaCard isReportable={true} />
          <div className="container flex gap-6">
  <div className="w-1/2">
          <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          History as a driver
          </h2>
          {drives.map((drive, index) => (
        <UserDriveCard key={index} drive={drive} />
      ))}
       
       
      </div>
      <div className="w-1/2">
      <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          History as a rider
          </h2>          {rides.map((ride, index) => (
        <UserRideCard key={index} ride={ride} />
      ))}
     
      </div>
      </div>
      <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Reviews
          </h2>  
      <ReviewCarousel reviews={reviews} />
        </div>
      </div>
    </>
  );
}
export default UserProfiles;