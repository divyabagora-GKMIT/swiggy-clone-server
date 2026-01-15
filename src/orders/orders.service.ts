import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      return this.dataSource.transaction(async (manager) => {
        const cartRepository = manager.getRepository(Cart);
        const cartItemRepository = manager.getRepository(CartItem);
        const orderRepository = manager.getRepository(Order);
        const orderItemRepository = manager.getRepository(OrderItem);
        const addressRepository = manager.getRepository(Address);
        const transactionRepo = manager.getRepository(Transaction);

        const cart = await cartRepository.findOne({
          where: { user: { id: userId } },
        });

        if (!cart) {
          throw new BadRequestException(
            'You should have atleast one item to order',
          );
        }

        const cartItems = await cartItemRepository.find({
          where: { cart: { id: cart.id } },
          relations: ['item', 'item.restaurant'],
        });

        const subTotal = cartItems.reduce(
          (acc, current) => acc + current.item.price * current.quantity,
          0,
        );

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

        const restaurantId = cartItems[0].item.restaurant.id;

        const gst = Math.round(subTotal * 0.05 * 100) / 100;
        const delivery_charge = 30.0;

        const total_amount = subTotal + gst + delivery_charge;

        const order = orderRepository.create({
          user: { id: userId },
          status: OrderStatus.PENDING,
          restaurant: { id: restaurantId },
          gst,
          delivery_charge,
          total_amount,
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async createTransaction(userId: number, orderId: number): Promise<boolean> {
    try {
      return this.dataSource.transaction(async (manager) => {
        const transactionRepo = manager.getRepository(Transaction);
        const cartRepo = manager.getRepository(Cart);
        const cartItemRepo = manager.getRepository(CartItem);
        const orderRepository = manager.getRepository(Order);

        const order = await this.orderRepository.findOne({
          where: { id: orderId },
        });

        if (!order) {
          throw new NotFoundException('Order not exist');
        }

        const createdTransaction = transactionRepo.create({
          order: { id: orderId },
          status: TransactionStatus.SUCCESS,
          payment_mode: PaymentMode.PREPAID,
          payment_type: PaymentType.UPI,
        });

        const transaction = await transactionRepo.save(createdTransaction);

        if (transaction.status === TransactionStatus.SUCCESS) {
          await orderRepository.save(
            orderRepository.merge(order, { status: OrderStatus.UNASSINGED }),
          );
        }

        const cart = await cartRepo.findOne({
          where: { user: { id: userId } },
        });

        if (cart) {
          await cartItemRepo.softDelete({ cart: { id: cart.id } });
          await cartRepo.softRemove(cart);
        }

        return true;
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUnassignedOrders(status: string) {
    try {
      if (!status) {
        throw new BadRequestException('status is required');
      }

      const enumStatus = status.toUpperCase() as OrderStatus;

      if (!Object.values(OrderStatus).includes(enumStatus)) {
        throw new BadRequestException('Invalid status.');
      }

      return this.orderRepository.find({
        where: { status: enumStatus },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateOrderStatus(
    orderId: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });
      if (!order) {
        throw new NotFoundException('Order not exist');
      }

      const updatedOrder = this.orderRepository.merge(
        order,
        updateOrderStatusDto,
      );
      return await this.orderRepository.save(updatedOrder);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async viewMyOrders(userId: number) {
    try {
      const orders = await this.orderRepository.find({
        where: { user: { id: userId } },
      });
      return orders;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
