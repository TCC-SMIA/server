import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

import User from '@domains/users/infra/typeorm/entities/User';
import Message from './Message';

@Entity('chats')
class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  destinatary: User;

  @OneToMany(() => Message, messages => messages.chat, { eager: true })
  messages!: Message[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Chat;
