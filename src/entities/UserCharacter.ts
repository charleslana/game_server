import { Character } from '@/entities/Character';
import { Exclude, Expose } from 'class-transformer';
import { User } from '@/entities/User';
import { UserCharacterGroup } from '@/entities/UserCharacterGroup';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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
  level!: number;

  @Column({ type: 'int', default: 1 })
  hp!: number;

  @Column({ type: 'int', default: 1 })
  mp!: number;

  @Column({ type: 'int', default: 1 })
  strength!: number;

  @Column({ type: 'int', default: 1 })
  intelligence!: number;

  @Column({ type: 'int', default: 1 })
  dexterity!: number;

  @Column({ type: 'int', default: 10 })
  point!: number;

  @Column({ name: 'spent_point', type: 'int', nullable: true })
  spentPoint!: number | null;

  @Column({ type: 'bigint', default: 1000 })
  alz!: number;

  @Column({ type: 'int', default: 0 })
  honor!: number;

  @Column({ name: 'name_color', type: 'varchar', length: 7, nullable: true })
  nameColor!: string | null;

  @Column({ type: 'int', default: 100 })
  stamina!: number;

  @Column({ type: 'bigint', default: 0 })
  experience!: number;

  @Column({
    name: 'name_time',
    type: 'timestamp',
    nullable: true,
  })
  nameTime!: Date | null;

  @Column({
    name: 'vip_time',
    type: 'timestamp',
    nullable: true,
  })
  vipTime!: Date | null;

  @Column({ type: 'text', nullable: true })
  @Exclude({ toPlainOnly: true })
  image!: string | null;

  @Expose()
  get avatar(): string | null {
    if (this.image) {
      return `${process.env.HOST}/public/upload/character/${this.image}`;
    } else {
      return null;
    }
  }

  @Column({ type: 'boolean', default: true })
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

  @ManyToOne(() => Character, character => character.userCharacters, {
    nullable: false,
  })
  @JoinColumn({ name: 'character_id' })
  character!: Character;

  @ManyToOne(() => User, user => user.characters)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(
    () => UserCharacterGroup,
    userCharacterGroup => userCharacterGroup.userCharacterGroup
  )
  @JoinColumn({ name: 'character_id', referencedColumnName: 'id' })
  userCharacters!: UserCharacterGroup[];
}
