import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

import { Exclude, Expose } from 'class-transformer';

@Entity('agencies')
class Agency {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  cnpj!: string;

  @Column()
  email!: string;

  @Column({ type: 'real' })
  latitude!: number;

  @Column({ type: 'real' })
  longitude!: number;

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

export default Agency;
