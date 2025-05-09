export interface CommonRide {
    id: number;
    departure: string;
    arrival: string;
    date: string;
}

export interface CreateReportPayload {
    subjectType: string;
    reason: string;
    reporterId: number;
    reportedUserId: number;
    reportedRideId?: number;
    proof?: File;
}

export interface ReportFormProps {
    reporterId: number;
    reporterName: string;
    reporterEmail: string;
    reportedUser: {
        id: number;
        name: string;
        lastName: string;
        email: string;
    };
}