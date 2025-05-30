import {ReportStatus} from "src/enums/report-status.enum";
import {ReportSubjectType} from "src/enums/report-subject-type.enum";

export interface ReportPayload {
    reportId: number;
    subjectType: ReportSubjectType;
    reporterId: number;
    reason: string;
    status: ReportStatus;
}