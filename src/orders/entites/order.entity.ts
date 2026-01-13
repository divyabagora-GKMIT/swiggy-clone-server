import { User } from 'src/users/entities/user.entity';
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
  OneToMany,
} from 'typeorm';
import { OrderItem } from 'src/orders/entites/order-items.entity';

export enum OrderStatus {
  PREPARING = 'PREPARING',
  UNASSINGED = 'UNASSIGNED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => User)
  @JoinColumn({ name: 'delivery_partner_id' })
  deliveryPartner: User;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @Column({
    type: 'enum',
    enum: OrderStatus,
    nullable: false,
  })
  status: OrderStatus;

  @Column({
    type: 'float',
    nullable: false,
  })
  total_amount: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  gst: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  delivery_charge: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  address: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deletedAt: Date;
}
