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

  @ManyToOne(() => Complaint, complaint => complaint.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'complaint_id' })
  complaint!: Complaint;

  @Column({ nullable: true })
  user_id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ nullable: true })
  agency_id!: string;

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
