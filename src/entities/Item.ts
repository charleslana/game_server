import ClassEnum from '@/enum/ClassEnum';
import ItemConsumableTypeEnum from '@/enum/ItemConsumableTypeEnum';
import ItemEquipmentTypeEnum from '@/enum/ItemEquipmentTypeEnum';
import ItemTypeEnum from '@/enum/ItemTypeEnum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_item' })
export class Item {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'int', nullable: true })
  strength!: number | null;

  @Column({ type: 'int', nullable: true })
  intelligence!: number | null;

  @Column({ type: 'int', nullable: true })
  dexterity!: number | null;

  @Column({ type: 'int', nullable: true })
  hp!: number | null;

  @Column({ type: 'int', nullable: true })
  mp!: number | null;

  @Column({ type: 'int', nullable: true })
  defense!: number | null;

  @Column({
    type: 'enum',
    enum: ClassEnum,
    nullable: true,
  })
  class!: ClassEnum | null;

  @Column({
    type: 'enum',
    enum: ItemTypeEnum,
  })
  type!: ItemTypeEnum;

  @Column({
    name: 'equipment_type',
    type: 'enum',
    enum: ItemEquipmentTypeEnum,
    nullable: true,
  })
  equipmentType!: ItemEquipmentTypeEnum | null;

  @Column({
    name: 'consumable_type',
    type: 'enum',
    enum: ItemConsumableTypeEnum,
    nullable: true,
  })
  consumableType!: ItemConsumableTypeEnum | null;

  @Column({ name: 'level_required', type: 'int', nullable: true })
  levelRequired!: number | null;

  @Column({ name: 'strength_required', type: 'int', nullable: true })
  strengthRequired!: number | null;

  @Column({ name: 'intelligence_required', type: 'int', nullable: true })
  intelligenceRequired!: number | null;

  @Column({ name: 'dexterity_required', type: 'int', nullable: true })
  dexterityRequired!: number | null;

  @Column({ name: 'duration_hour', type: 'int', nullable: true })
  durationHour!: number | null;

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
}