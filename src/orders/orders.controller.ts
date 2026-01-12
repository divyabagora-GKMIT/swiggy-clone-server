import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateOrderStatusDto } from './dto/update-order.dto';

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

    @Get()
    async getUnassignedOrders (@Query('status') status : string){
        const orders = await this.ordersService.getUnassignedOrders(status);
        if (!orders.length){
            return {
                message : "No orders Available"
            }
        }
        return {
            message : "Orders fetch successfully",
            data: orders
        }
    }   

    @Patch(':id')
    async updateOrderStatus (@Param('id') id : string, @Body()updateOrderStatusDto : UpdateOrderStatusDto){
        const result = await this.ordersService.updateOrderStatus(+id, updateOrderStatusDto);

        return {
            message : "Status Updated successfully"
        }
    }
}
