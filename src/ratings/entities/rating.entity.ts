import { User } from 'src/users/entities/user.entity';
import { Item } from 'src/items/entities/item.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { Order } from 'src/orders/entites/order.entity';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * User who gave the rating
   */
  @ManyToOne(() => User, (user) => user.ratings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  /**
   * Rated item (optional if rating is for restaurant)
   */
  @ManyToOne(() => Item, (item) => item.ratings, { nullable: true })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  /**
   * Rated restaurant
   */
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.ratings)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @OneToOne(() => Order)
  @JoinColumn({name : 'order_id'})
  order : Order

  @Column({
    type: 'float',
    nullable: false,
  })
  rating: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  comment: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' , select: false})
  deletedAt: Date;
}
