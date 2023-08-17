import { Exclude } from 'class-transformer';
import { UserCharacter } from '@/entities/UserCharacter';
import { UserRole } from '@/entities/UserRole';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_user' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string;

  @Column({ type: 'text' })
  @Exclude({ toPlainOnly: true })
  password!: string;

  @Column({ type: 'varchar', length: 20 })
  name!: string;

  @Column({ type: 'bigint', default: 0 })
  credit!: number;

  @Column({
    name: 'banned_time',
    type: 'timestamp',
    nullable: true,
  })
  bannedTime!: Date | null;

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

  @OneToMany(() => UserRole, userRole => userRole.user)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  roles!: UserRole[];

  @OneToMany(() => UserCharacter, userCharacter => userCharacter.user)
  characters!: UserCharacter[];
}
