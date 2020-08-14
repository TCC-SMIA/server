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

import { Expose, Exclude } from 'class-transformer';

@Entity('complaints')
class Complaint {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @Exclude()
  user_id!: string;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  @Exclude()
  user!: User;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ default: false })
  resolved!: boolean;

  @Column({ nullable: true })
  image: string;

  @Column('timestamp with time zone')
  date!: Date;

  @Column({ type: 'real' })
  latitude!: number;

  @Column({ type: 'real' })
  longitude!: number;

  @Column()
  anonymous!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Expose({ name: 'image_url' })
  getAvatarUrl(): string | null {
    if (!this.image) {
      return null;
    }

    return `${process.env.APP_URL}/files/${this.image}`;
  }
}

export default Complaint;
