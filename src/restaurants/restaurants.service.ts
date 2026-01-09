import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { City } from 'src/cities/entities/city.entity';
import { Item } from 'src/items/entities/item.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Restaurant)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}
  async createRestaurant(createRestaurantDto: CreateRestaurantDto) {
    const { userId, cityId, ...rest } = createRestaurantDto;

    const city = await this.cityRepository.findOneBy({
      id: cityId,
    });

    if (!city) {
      throw new NotFoundException('City not exist');
    }
    const createdRestaurant = this.restaurantRepository.create({
      ...rest,
      user: { id: userId },
      city,
    });
    return await this.restaurantRepository.save(createdRestaurant);
  }

  async viewRestaurants(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.restaurantRepository.findAndCount({
      take: limit,
      skip: skip,
      order: {
        id: 'DESC',
      },
    });

    return data;
  }

  async viewRestaurantItems(restaurantId: number) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return await this.itemRepository.find({
      where: { restaurant: { id: restaurantId } },
      order: {
        name: 'ASC',
      },
    });
  }
}
