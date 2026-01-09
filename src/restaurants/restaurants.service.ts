import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}
  async createRestaurant(createRestaurantDto: CreateRestaurantDto) {
    const { userId,cityId,...rest } = createRestaurantDto;
    const createdRestaurant = this.restaurantRepository.create({
      ...rest,
      user: { id: userId } ,
      city : {id : cityId},
    });
    return await this.restaurantRepository.save(createdRestaurant);
  }
}
