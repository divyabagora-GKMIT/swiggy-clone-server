import { OrderStatus } from '../entites/order.entity';
import { IsEnum } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, {
    message: "Status value is not valid",
  })
  status: OrderStatus;
}
