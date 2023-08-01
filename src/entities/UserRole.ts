import UserRoleEnum from '@/enum/UserRoleEnum';
import { User } from '@/entities/User';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_user_role' })
export class UserRole {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.User,
  })
  role!: UserRoleEnum;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  @ManyToOne(() => User, user => user.roles, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
