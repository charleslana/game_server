import GroupRoleEnum from '@/enum/GroupRoleEnum';
import { Exclude } from 'class-transformer';
import { Group } from '@/entities/Group';
import { UserCharacter } from './UserCharacter';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_user_character_group' })
export class UserCharacterGroup {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({
    type: 'enum',
    enum: GroupRoleEnum,
    default: GroupRoleEnum.Member,
  })
  role!: GroupRoleEnum;

  @Column({ name: 'arena_point', type: 'int', default: 0 })
  arenaPoint!: number;

  @Column({ type: 'boolean', default: false })
  @Exclude({ toPlainOnly: true })
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

  @ManyToOne(() => Group, group => group.groupCharacters, { nullable: false })
  @JoinColumn({ name: 'group_id' })
  userCharacterGroup!: Group;

  @ManyToOne(
    () => UserCharacter,
    userCharacter => userCharacter.userCharacters,
    { nullable: false }
  )
  @JoinColumn({ name: 'character_id' })
  userCharacter!: UserCharacter;
}
