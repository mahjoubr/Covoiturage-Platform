// src/graphql/queries/reportQueries.ts
import { gql } from '@apollo/client';
export const GET_MY_REPORTS = gql`
    query getMyReports {
        getMyReports {
            id
            subjectType
            reason
            proofPath
            proofUrl
            status
            createdAt
            reporter {
                id
                name
                lastName
                imageUrl
            }
            reportedUser {
                id
                name
                lastName
                imageUrl
            }
            reportedRide {
                id
                departure
                arrival
                date
                time
            }
        }
    }
`;


