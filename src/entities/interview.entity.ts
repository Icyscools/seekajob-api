import { ApplicationStatus } from 'src/modules/core/applications/dto/application.dto';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Application } from '.';

@Entity()
export class Interview {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Application, (application) => application.interview)
  @JoinColumn()
  application: Application;

  @Column({ type: 'datetime' })
  datetime: Date;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
