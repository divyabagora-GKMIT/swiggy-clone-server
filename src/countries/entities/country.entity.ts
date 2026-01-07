import { Exclude } from 'class-transformer';
import { State } from 'src/states/entities/state.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'countries' })
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 56,
  })
  name: string;

  @OneToMany(() => State, (state) => state.country)
  states: State[];
  
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
    type: 'timestamp',
  })
  deletedAt: Date;
}
