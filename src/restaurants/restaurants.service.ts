import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { ILike, Repository } from 'typeorm';
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
  async createRestaurant(
    userId: number,
    createRestaurantDto: CreateRestaurantDto,
  ) {
    const { cityId, name, ...rest } = createRestaurantDto;
    console.log(cityId);
    const city = await this.cityRepository.findOne({
      where: { id: +cityId },
    });
    console.log(city);

    if (!city) {
      throw new NotFoundException('City not exist');
    }
    const lowerCaseName  = name.toLowerCase();
    const createdRestaurant = this.restaurantRepository.create({
      ...rest,
      name: lowerCaseName,
      user: { id: userId },
      city: { id: cityId },
    });
    return await this.restaurantRepository.save(createdRestaurant);
  }

  async viewRestaurants(page: number = 1, limit: number = 10, name = '') {
    const skip = (page - 1) * limit;
    const where = name ? { name: ILike(`%${name}%`) } : {};
    const [data, total] = await this.restaurantRepository.findAndCount({
      where,
      take: limit,
      skip: skip,
      order: {
        id: 'DESC',
      },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async viewRestaurantItems(
    restaurantId: number,
    page: number = 1,
    limit: number = 10,
    name: string = '',
    orderBy: string = 'price',
    sort: 'ASC' | 'DESC' = 'ASC',
  ) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    const skip = (page - 1) * limit;

    const where: any = {
      restaurant: { id: restaurantId },
    };

    if (name) {
      where.name = ILike(`%${name}%`);
    }
    const [data, total] = await this.itemRepository.findAndCount({
      where,
      take: limit,
      skip,
      order: {
        [orderBy]: sort,
      },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
