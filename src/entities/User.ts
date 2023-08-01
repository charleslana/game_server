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
