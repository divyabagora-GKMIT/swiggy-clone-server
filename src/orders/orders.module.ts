import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/cart/entities/cart.entity';
import { Order } from './entites/order.entity';
import { CartItem } from 'src/cart/entities/cart-items.entity';
import { Address } from 'src/users/entities/address.entity';
import { OrderItem } from './entites/order-items.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Cart,Order,CartItem,Address,OrderItem])],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
