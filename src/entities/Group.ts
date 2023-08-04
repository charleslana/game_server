import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_group' })
export class Group {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 4, unique: true })
  tag!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string | null;

  @Column({ name: 'arena_point', type: 'int', default: 0 })
  arenaPoint!: number;

  @Column({ type: 'int', default: 1 })
  level!: number;

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
