import { Company } from 'src/modules/users/entities';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  location: string;

  @Column()
  salary: string;

  @Column()
  recruit_amount: number;

  @Column({ nullable: true })
  welfare?: string;

  @ManyToOne(() => Company, (company) => company.jobs)
  company: Company;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
