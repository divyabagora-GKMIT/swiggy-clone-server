import { Item } from 'src/items/entities/item.entity';
import { Order } from 'src/orders/entites/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';


@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'item_id' })
  item: Item;


  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'int' })
  quantity: number;


  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', select: false})
  deletedAt: Date;
}
