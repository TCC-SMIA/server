import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import path from 'path';
import fs from 'promise-fs';

import multerConfig from '@config/multerConfig';
import User from '@domains/users/infra/typeorm/entities/User';
import Comment from '@domains/complaints/infra/typeorm/entities/Comment';
import { ComplaintStatusEnum } from '@domains/complaints/enums/ComplaintStatusEnum';
import { ComplaintTypeEnum } from '@domains/complaints/enums/ComplaintTypeEnum';

@Entity('complaints')
class Complaint {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  user_id!: string;

  @ManyToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ default: ComplaintStatusEnum.New })
  status!: string;

  @Column({ default: ComplaintTypeEnum.Others })
  type!: string;

  @Column({ nullable: true })
  image: string;

  @Column('timestamp with time zone')
  date!: Date;

  @Column({ type: 'real' })
  latitude!: number;

  @Column({ type: 'real' })
  longitude!: number;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ default: false })
  anonymous!: boolean;

  @OneToMany(() => Comment, comments => comments.complaint, { eager: true })
  comments!: Comment[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Expose({ name: 'image_url' })
  getAvatarUrl(): string | null {
    if (!this.image) return null;

    try {
      if (fs.existsSync(path.resolve(multerConfig.uploadsFolder, this.image))) {
        return `${process.env.APP_URL}/files/${this.image}`;
      }
      return null;
    } catch {
      return null;
    }
  }
}

export default Complaint;
