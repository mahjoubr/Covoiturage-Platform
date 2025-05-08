import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import PageMeta from "../components/common/PageMeta";
import { Drive, Review, Ride } from "../types";
import UserDriveCard from "../components/UserProfile/UserDriveCard";
import UserRideCard from "../components/UserProfile/UserRideCard";
import ReviewCarousel from "../components/UserProfile/ReviewCarousel";
import { useState } from "react";
import { useRidesPaginatedByDriver, useRidesPaginatedByPassenger } from "../services/ridesService";

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
    const UserProfiles = () => {
      const [page] = useState(1);
      const limit = 2;
    
      const {
        loading: loadingDriver,
        error: errorDriver,
        data: driverData,
      }= useRidesPaginatedByDriver(page, limit);
      const driverRides = driverData?.getRidesPaginatedByDriver?.data ?? [];
      const drives: Drive[] = driverRides.map((ride: any) => ({
        from: ride.departure,
        to: ride.arrival,
        date: new Date(ride.date).toLocaleDateString('en-CA'),
        time: ride.time,
        state: ride.state,
        riders: ride.appUserRides?.map((r: any) =>
          `${r.appUser?.name ?? ''} ${r.appUser?.lastName ?? ''}`.trim()
        ).filter(Boolean) ?? [],
      }));

      const {
        loading: loadingPassenger,
        error: errorPassenger,
        data: passengerData,
      }= useRidesPaginatedByPassenger(page, limit);
      const passengerRides = passengerData?.getRidesPaginatedByPassenger?.data ?? [];
      const rides: Ride[] = passengerRides.map((ride: any) => ({
        from: ride.departure,
        to: ride.arrival,
        date: new Date(ride.date).toLocaleDateString('en-CA'),
        time: ride.time,
        state: ride.state,
        driver: 
          `${ride.driver?.name ?? ''} ${ride.driver?.lastName ?? ''}`.trim(),
      }));
    
    
      return (
        <>
          <PageMeta title="Profile" description="" />
          <PageBreadcrumb pageTitle="Profile" />
    
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <div className="space-y-6">
              <UserMetaCard isEditable={false} isReportable={true} />
    
              <div className="container flex gap-6">
                <div className="w-1/2">
                  <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                    History as a driver
                  </h2>
    
                  {loadingDriver ? (
                    <p>Loading driver history...</p>
                  ) : errorDriver ? (
                    <p>Error loading driver rides</p>
                  ) : (
                    drives.map((drive: any) => (
                      <UserDriveCard key={drive.id} drive={drive} />
                    ))
                  )}
                </div>
    
      <div className="w-1/2">
      <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          History as a rider
          </h2>  
          {loadingPassenger ? (
                    <p>Loading rider history...</p>
                  ) : errorPassenger ? (
                    <p>Error loading rider rides</p>
                  ) : (
                    rides.map((ride, index) => (
                      <UserRideCard key={index} ride={ride} />
                    ))
          
      )}
     
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