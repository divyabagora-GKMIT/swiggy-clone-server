import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { AddCartItemDto } from './dto/add-item.dto';
import { CartItem } from './entities/cart-items.entity';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async createCart(userId: number) {
    const cartExist = await this.cartRepository.findOne({
      where: { user: { id: userId } },
    });

    if (cartExist) {
      throw new ConflictException('User cart already exists');
    }

    const createCart = this.cartRepository.create({ user: { id: userId } });
    return await this.cartRepository.save(createCart);
  }

  async addItemToCart(addCartItemDto: AddCartItemDto, userId: number) {
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

    if (cartItem) {
      cartItem.quantity += addCartItemDto?.quantity;
    } else {
      cartItem = this.cartItemRepository.create({
        cart,
        item: { id: addCartItemDto?.itemId },
        quantity: addCartItemDto?.quantity,
      });
    }

    return await this.cartItemRepository.save(cartItem);
  }

  async updateItemToCart(
    updateCartItemDto: UpdateCartItemDto,
    userId: number,
    itemId: number,
  ) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
    });

    const cartItem = await this.cartItemRepository.findOne({
      where: {
        cart: { id: cart?.id },
        item: { id: itemId },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found in your cart');
    }

    Object.assign(cartItem, updateCartItemDto);
    return await this.cartItemRepository.save(cartItem);
  }
}
