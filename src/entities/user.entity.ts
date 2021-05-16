import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Worker, Company } from '.';
import { UserRole } from 'src/modules/core/users/dto/user.dto';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'text', nullable: true })
  profile_img?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.WORKER,
  })
  role: UserRole;

  @OneToOne(() => Company, (company) => company.user, { nullable: true })
  company?: Company;

  @OneToOne(() => Worker, (worker) => worker.user, { nullable: true })
  worker?: Worker;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
