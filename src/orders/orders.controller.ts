import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService : OrdersService
    ){}
    @Post()
    @UseGuards(JwtAuthGuard)
    async createOrder (@Req() req , @Body() createOrderDto : CreateOrderDto){
        const userId = req.user.userId
        const result = await this.ordersService.createOrder(+userId, createOrderDto);

        return {
            message : "Your order has been created",
            data : result
        }
    }
}
