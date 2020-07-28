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

@Entity('complaints')
class Complaint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: false })
  resolved: boolean;

  @Column('timestamp with time zone')
  date: Date;

  @Column({ type: 'point', nullable: true })
  location: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Complaint;
