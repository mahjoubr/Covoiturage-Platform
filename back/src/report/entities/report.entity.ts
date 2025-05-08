import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { AppUser } from 'src/app-user/entities/app-user.entity';
import { Ride } from 'src/ride/entities/ride.entity';
import { ReportSubjectType } from 'src/enums/report-subject-type.enum';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType() // Expose this class as a GraphQL type
@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    @Field() // Expose this field in GraphQL
    id: number;

    @Column({ type: 'enum', enum: ReportSubjectType })
    @Field(() => String) // Enums are exposed as Strings in GraphQL
    subjectType: ReportSubjectType;

    @ManyToOne(() => AppUser, { nullable: true })
    @Field(() => AppUser, { nullable: true }) // Nullable if not always set
    reportedUser?: AppUser;

    @ManyToOne(() => Ride, { nullable: true })
    @Field(() => Ride, { nullable: true }) // Nullable if not always set
    reportedRide?: Ride;

    @ManyToOne(() => AppUser)
    @Field(() => AppUser) // Reporter (always required)
    reporter: AppUser;

    @Column({ type: 'text' })
    @Field() // Expose reason for the report
    reason: string;

    @Column({ type: 'text', nullable: true })
    @Field({ nullable: true }) // Optional URL for proof
    proofUrl?: string;

    @CreateDateColumn()
    @Field(() => Date) // Expose creation date
    createdAt: Date;
}

