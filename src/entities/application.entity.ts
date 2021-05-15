import { ApplicationStatus } from 'src/modules/core/applications/dto/application.dto';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Job, Worker, Interview } from '.';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  resume: string;

  @ManyToOne(() => Job, (job) => job.applications)
  job: Job;

  @ManyToOne(() => Worker, (worker) => worker.applications)
  worker: Worker;

  @OneToOne(() => Interview, (interview) => interview.application)
  interview: Interview;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.WAITING,
  })
  approved_status: ApplicationStatus;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
