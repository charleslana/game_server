import BreedEnum from '@/enum/BreedEnum';
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

@Entity({ name: 'tb_user_character' })
export class UserCharacter {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  name!: string;

  @Column({ type: 'int', default: 1 })
  level!: string;

  @Column({
    type: 'enum',
    enum: BreedEnum,
  })
  breed!: BreedEnum;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

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

  @ManyToOne(() => User, user => user.characters)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
