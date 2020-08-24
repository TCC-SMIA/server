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
import Complaint from './Complaint';

@Entity('comments')
class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  complaint_id!: string;

  @ManyToOne(() => Complaint, { cascade: true })
  @JoinColumn({ name: 'complaint_id' })
  complaint!: Complaint;

  @Column()
  user_id!: string;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  content!: string;

  @Column('timestamp with time zone')
  date!: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

export default Comment;
