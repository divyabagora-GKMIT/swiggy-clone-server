import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { AddCartItemDto } from './dto/add-item.dto';
import { CartItem } from './entities/cart-items.entity';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Item } from 'src/items/entities/item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,

    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async createCart(userId: number) {
    try {
      const cartExist = await this.cartRepository.findOne({
        where: { user: { id: userId } },
      });

      if (cartExist) {
        throw new ConflictException('User cart already exists');
      }

      const createCart = this.cartRepository.create({ user: { id: userId } });
      return await this.cartRepository.save(createCart);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async addItemToCart(addCartItemDto: AddCartItemDto, userId: number) {
    try {
      const item = await this.itemRepository.findOne({
        where: { id: addCartItemDto.itemId },
      });

      if (!item) {
        throw new NotFoundException('Item does not exist');
      }
      let cart = await this.cartRepository.findOne({
        where: { user: { id: userId } },
      });

      if (!cart) {
        cart = await this.createCart(userId);
      }

      let cartItem = await this.cartItemRepository.findOne({
        where: {
          cart: { id: cart.id },
          item: { id: addCartItemDto.itemId },
        },
      });

      if (!cartItem) {
        const itemCount = await this.cartItemRepository.count({
          where: { cart: { id: cart.id } },
        });

        if (itemCount >= 5) {
          throw new BadRequestException(
            'Cart limit reached. You cannot add more than 5 distinct items.',
          );
        }

        cartItem = this.cartItemRepository.create({
          cart: cart,
          item: { id: addCartItemDto.itemId },
          quantity: addCartItemDto.quantity,
        });
      } else {
        cartItem.quantity += addCartItemDto.quantity;
      }

      return await this.cartItemRepository.save(cartItem);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateItemToCart(
    updateCartItemDto: UpdateCartItemDto,
    userId: number,
    itemId: number,
  ) {
    try {
      const cart = await this.cartRepository.findOne({
        where: { user: { id: userId } },
      });

      if (!cart) {
        throw new NotFoundException('Your cart has been deleted');
      }

      const cartItem = await this.cartItemRepository.findOne({
        where: {
          cart: { id: cart.id },
          item: { id: itemId },
        },
      });

      if (!cartItem) {
        throw new NotFoundException('Item not found in your cart');
      }

      Object.assign(cartItem, updateCartItemDto);
      return await this.cartItemRepository.save(cartItem);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
