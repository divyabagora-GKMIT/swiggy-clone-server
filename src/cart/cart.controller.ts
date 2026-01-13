import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCart(@Req() req) {
    const userId = req.user.userId;
    await this.cartService.createCart(+userId);
    return {
      message: 'Cart initiated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('items')
  @HttpCode(200)
  async addItemToCart(@Body() addCartItemDto: AddCartItemDto, @Req() req) {
    const userId = req.user.userId;
    const result = await this.cartService.addItemToCart(addCartItemDto, +userId);
    return {
      message: 'Item added to Cart',
      data : result
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('items/:id')
  async updateItemToCart(
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Param('id',new ParseIntPipe()) id: number ,
    @Req() req 
  ) {
    const userId = req.user.userId;
    const updatedItem  = await this.cartService.updateItemToCart(updateCartItemDto, +userId, +id);
    return {
        message: "Cart item updated successfully",
        data : updatedItem
    }
  }
}
