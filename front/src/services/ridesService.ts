import { useQuery } from "@apollo/client";
import { GET_RIDES_DRIVER_PAGINATED, GET_RIDES_PASSENGER_PAGINATED } from "../graphQl/queries/rides";

export const useRidesPaginatedByDriver = (page: number, limit: number,id?: number) => {
    const { loading, error, data, refetch } = useQuery(GET_RIDES_DRIVER_PAGINATED, {
      variables: { page, limit , id},
      fetchPolicy: 'network-only',
    });
  
    return { loading, error, data, refetch };
  };


  export const useRidesPaginatedByPassenger = (page: number, limit: number, id?: number) => {
    const { loading, error, data, refetch } = useQuery(GET_RIDES_PASSENGER_PAGINATED, {
      variables: { page, limit ,id},
      fetchPolicy: 'network-only',
    });
  
    return { loading, error, data, refetch };
  };