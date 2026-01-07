import { City } from 'src/cities/entities/city.entity';
import { Item } from 'src/items/entities/item.entity';
import { Order } from 'src/orders/entites/order.entity';
import { Rating } from 'src/ratings/entities/rating.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

export enum RestaurantClassification {
  VEG = 'VEG',
  NON_VEG = 'NON-VEG',
  BOTH = 'BOTH',
}

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.restaurants)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => City, (city) => city.restaurants)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @OneToMany(() => Restaurant, (restaurant) => restaurant.orders)
  orders: Order[];

  @OneToMany(() => Item, (item) => item.restaurant)
  items: Item[];

  @OneToMany(() => Rating, (rating) => rating.restaurant)
  ratings: Rating[];

  @Column({
    length: 10,
    nullable: false,
  })
  pincode: string;

  @Column({
    length: 30,
    nullable: false,
  })
  name: string;

  @Column({
    length: 255,
    nullable: true,
  })
  image: string;

  @Column({
    type: 'enum',
    enum: RestaurantClassification,
    nullable: false,
  })
  classification: RestaurantClassification;

  @Column({
    type: 'float',
    nullable: false,
  })
  latitude: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  longitude: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  radius: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
