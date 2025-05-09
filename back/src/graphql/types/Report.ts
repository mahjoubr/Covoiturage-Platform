import {ObjectType, Field, Int, registerEnumType} from '@nestjs/graphql';
import { ReportSubjectType } from '../../enums/report-subject-type.enum';
import {ReportStatus} from "src/enums/report-status.enum";

@ObjectType()
export class Report {
    @Field(() => Int)
    id: number;

    @Field(() => ReportSubjectType) // Fix here: specify the enum type
    subjectType: ReportSubjectType;

    @Field()
    reason: string;

    @Field({ nullable: true })
    proofPath?: string;

    @Field({ nullable: true })
    proofUrl?: string;

    @Field( () => ReportStatus)
    status: ReportStatus;

    @Field()
    createdAt: Date;


}

