import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { City } from 'src/cities/entities/city.entity';
import { Item } from 'src/items/entities/item.entity';
import { ItemsService } from 'src/items/items.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, City, Item])],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, ItemsService],
})
export class RestaurantsModule {}
