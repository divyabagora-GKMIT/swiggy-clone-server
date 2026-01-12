import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderRatingDto } from './dto/rating.dto';
import { Order } from 'src/orders/entites/order.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async rateOrder(createOrderRatingDto: CreateOrderRatingDto, userId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: createOrderRatingDto.orderId },
      relations: ['orderItems', 'restaurant', 'orderItems.item'],
    });

    if (!order) throw new NotFoundException('Order not found');
    const alreadyRated = await this.ratingRepository.findOne({
      where: { order: { id: order.id } },
    });
    if (alreadyRated) throw new BadRequestException('Order already rated');

    const ratingsToSave: Rating[] = [];
    const orderItemsIds = order.orderItems.map((oi) => oi.item.id);
    console.log(orderItemsIds);

    if (!createOrderRatingDto.ratings) {
      for (const orderItem of order.orderItems) {
        console.log(orderItem);
        ratingsToSave.push(
          this.ratingRepository.create({
            user: { id: userId },
            order: { id: order.id },
            restaurant: { id: order.restaurant.id },
            item: { id: orderItem.item.id },
            rating: createOrderRatingDto.rating,
            comment: createOrderRatingDto?.comment,
          }),
        );
      }
    } else {
      for (const r of createOrderRatingDto.ratings) {
        if (!orderItemsIds.includes(r.itemId)) {
          throw new BadRequestException(`Item ${r.itemId} not in this order`);
        }

        ratingsToSave.push(
          this.ratingRepository.create({
            user: { id: userId },
            order: { id: order.id },
            restaurant: { id: order.restaurant.id },
            item: { id: r.itemId },
            rating: r.rating,
            comment: r.comment,
          }),
        );
      }
    }

    await this.ratingRepository.save(ratingsToSave);
  }
}
