import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from './entities/rating.entity';
import { Order } from 'src/orders/entites/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rating,Order])],
  providers: [RatingsService],
  controllers: [RatingsController]
})
export class RatingsModule {}
