import { Order } from 'src/orders/entites/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

export enum TransactionStatus {
  SUCCESS = 'Success',
  FAILED = 'Failed',
  CANCELLED = 'Cancelled',
}

export enum PaymentMode {
  COD = 'COD',
  PREPAID = 'Prepaid',
}

export enum PaymentType {
  UPI = 'UPI',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Order, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
  })
  status: TransactionStatus;

  @Column({
    type: 'enum',
    enum: PaymentMode,
  })
  payment_mode: PaymentMode;

  @Column({
    type: 'enum',
    enum: PaymentType,
  })
  payment_type: PaymentType;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
