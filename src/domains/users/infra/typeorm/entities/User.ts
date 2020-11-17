import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import path from 'path';
import fs from 'promise-fs';
import { Exclude, Expose } from 'class-transformer';

import multerConfig from '@config/multerConfig';
import { stringTransformer } from '@shared/utils/transformers';
import { UserTypes } from '@domains/users/enums/UserEnums';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true, transformer: stringTransformer, nullable: true })
  nickname?: string;

  @Column({ unique: true, transformer: stringTransformer })
  email!: string;

  @Column({ unique: true, nullable: true })
  cnpj?: string;

  @Column({ nullable: false, default: UserTypes.Reporter })
  type!: string;

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
    if (!this.avatar) return null;

    try {
      if (
        fs.existsSync(path.resolve(multerConfig.uploadsFolder, this.avatar))
      ) {
        return `${process.env.APP_URL}/files/${this.avatar}`;
      }
      return null;
    } catch {
      return null;
    }
  }
}

export default User;
