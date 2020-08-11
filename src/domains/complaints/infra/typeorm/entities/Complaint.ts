import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from '@domains/users/infra/typeorm/entities/User';

import { Exclude } from 'class-transformer';

@Entity('complaints')
class Complaint {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @Exclude()
  user_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  @Exclude()
  user!: User;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ default: false })
  resolved!: boolean;

  @Column('timestamp with time zone')
  date!: Date;

  @Column({ type: 'real' })
  latitude!: number;

  @Column({ type: 'real' })
  longitude!: number;

  @Column({ default: false })
  anonymous!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

export default Complaint;
