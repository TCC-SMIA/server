import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

import { Exclude, Expose } from 'class-transformer';
import { stringTransformer } from '@shared/utils/transformers';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true, transformer: stringTransformer })
  nickname!: string;

  @Column({ unique: true, transformer: stringTransformer })
  email!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column({ nullable: true })
  avatar: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if (!this.avatar) {
      return null;
    }

    return `${process.env.APP_URL}/files/${this.avatar}`;
  }
}

export default User;
