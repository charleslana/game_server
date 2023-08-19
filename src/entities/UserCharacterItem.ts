import { Expose } from 'class-transformer';
import { Item } from '@/entities/Item';
import { UserCharacter } from '@/entities/UserCharacter';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_user_character_item' })
export class UserCharacterItem {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'int', nullable: true })
  enhancement!: number | null;

  @Column({ name: 'duration_time', type: 'timestamp', nullable: true })
  durationTime!: Date | null;

  @Column({ type: 'boolean', nullable: true })
  equipped!: boolean | null;

  @Expose()
  get price(): number {
    if (this.item.price && this.enhancement) {
      const calculatedPrice = this.item.price * this.enhancement;
      return calculatedPrice;
    }
    return this.item.price ?? 0;
  }

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

  @ManyToOne(
    () => UserCharacter,
    userCharacter => userCharacter.userCharacters,
    {
      nullable: false,
    }
  )
  @JoinColumn({ name: 'character_id' })
  userCharacter!: UserCharacter;

  @ManyToOne(() => Item, item => item.userCharacterItems, {
    nullable: false,
  })
  @JoinColumn({ name: 'item_id' })
  item!: Item;
}
