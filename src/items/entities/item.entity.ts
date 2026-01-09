import { Rating } from 'src/ratings/entities/rating.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { Cart } from 'src/users/entities/cart.entity';
import { CartItem } from 'src/users/entities/cart-items.entity';
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

export enum ItemClassification {
  VEG = 'VEG',
  NON_VEG = 'NON-VEG',
}

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.items)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @OneToMany(() => Rating, (rating) => rating.item)
  ratings: Rating[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.item)
  cartItems: CartItem[];

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  image: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'float',
    nullable: false,
  })
  price: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: ItemClassification,
    nullable: false,
  })
  classification: ItemClassification;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
