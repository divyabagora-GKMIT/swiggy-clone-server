import { Body, Controller, HttpCode, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/users/entities/user.entity';

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

    @UseGuards(JwtAuthGuard)
    @Post(':id/transactions')
    @HttpCode(200)
    async createTransaction (@Param('id') id : number, @Req() req){
        const userId = req.user.userId; 
        await this.ordersService.createTransaction(+userId, id);
        return {
            message : "Order has been placed successfully"
        }
    }

}
