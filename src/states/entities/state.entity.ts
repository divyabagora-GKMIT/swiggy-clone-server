import { Exclude } from 'class-transformer';
import { City } from 'src/cities/entities/city.entity';
import { Country } from 'src/countries/entities/country.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('states')
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true,
    length: 90,
  })
  name: string;

  @ManyToOne(() => Country, country => country.states)
  @JoinColumn({name: 'country_id'})
  country: Country

  @OneToMany(()=> City, city => city.state)
  cities : City[]

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
