import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-items.entity';
import { Item } from 'src/items/entities/item.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Cart, CartItem, Item])],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
