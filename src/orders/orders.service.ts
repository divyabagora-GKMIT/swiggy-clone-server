import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order, OrderStatus } from './entites/order.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart/entities/cart-items.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Address } from 'src/users/entities/address.entity';
import { OrderItem } from './entites/order-items.entity';
import {
  PaymentMode,
  PaymentType,
  Transaction,
  TransactionStatus,
} from './entites/transaction.entity';
import { create } from 'domain';
import { UpdateOrderStatusDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async createOrder(userId: number, createOrderDto: CreateOrderDto) {
    return this.dataSource.transaction(async (manager) => {
      const cartRepository = manager.getRepository(Cart);
      const cartItemRepository = manager.getRepository(CartItem);
      const orderRepository = manager.getRepository(Order);
      const orderItemRepository = manager.getRepository(OrderItem);
      const addressRepository = manager.getRepository(Address);

      const cart = await cartRepository.findOne({
        where: { user: { id: userId } },
      });

      if (!cart) {
        throw new NotFoundException('cart does not exist');
      }

      const cartItems = await cartItemRepository.find({
        where: { cart: { id: cart.id } },
        relations: ['item', 'item.restaurant'],
      });

      if (!cartItems.length) {
        throw new NotFoundException('Cart is empty');
      }

      const subTotal = cartItems.reduce(
        (acc, current) => acc + current.item.price * current.quantity,
        0,
      );

      const restaurantId = cartItems[0].item.restaurant.id;

      const deliveryAddress = await addressRepository.findOne({
        where: {
          id: createOrderDto.addressId,
          user: { id: userId },
        },
      });

      if (!deliveryAddress) {
        throw new NotFoundException(
          'Selected address not found or does not belong to you',
        );
      }
      const gst = subTotal * 0.05;
      const delivery_charge = 30;
      const order = orderRepository.create({
        user: { id: userId },
        status: OrderStatus.UNASSINGED,
        restaurant: { id: restaurantId },
        gst,
        delivery_charge,
        total_amount: subTotal + gst + delivery_charge,
        address: `${deliveryAddress.address} ${deliveryAddress.pincode}`,
      });

      const savedOrder = await orderRepository.save(order);

      const orderItems = cartItems.map((cartItem) =>
        orderItemRepository.create({
          order: savedOrder,
          item: cartItem.item,
          name: cartItem.item.name,
          quantity: cartItem.quantity,
          price: cartItem.item.price,
        }),
      );

      await orderItemRepository.save(orderItems);

      return savedOrder;
    });
  }

  async createTransaction(userId: number, orderId: number) {
    return this.dataSource.transaction(async (manager) => {
      const transactionRepo = manager.getRepository(Transaction);
      const cartRepo = manager.getRepository(Cart);
      const cartItemRepo = manager.getRepository(CartItem);

      const createdTransaction = transactionRepo.create({
        order: { id: orderId },
        status: TransactionStatus.SUCCESS,
        payment_mode: PaymentMode.PREPAID,
        payment_type: PaymentType.UPI,
      });

      await transactionRepo.save(createdTransaction);

      const cart = await cartRepo.findOne({
        where: { user: { id: userId } },
      });

      if (cart) {
        await cartItemRepo.softDelete({ cart: { id: cart.id } });
        await cartRepo.softRemove(cart);
      }

      return true;
    });
  }

  async getUnassignedOrders(status: string) {
    if (!status) {
      throw new BadRequestException('status is required');
    }

    const enumStatus = status.toUpperCase() as OrderStatus;

    if (!Object.values(OrderStatus).includes(enumStatus)) {
      throw new BadRequestException(
        'Invalid status.',
      );
    }

    return this.orderRepository.find({
      where: { status: enumStatus },
    });
  }

  async updateOrderStatus(orderId : number, updateOrderStatusDto : UpdateOrderStatusDto){
    const order = await this.orderRepository.findOne({
        where: {id : orderId}
    })
    if (!order) {
        throw new NotFoundException('Order not exist')
    }

    const updatedOrder = this.orderRepository.merge(order,updateOrderStatusDto);
    return await this.orderRepository.save(updatedOrder);
  }
}
