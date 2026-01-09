import { Body, Controller, Post } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Post()
  async createRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
    const result = await this.restaurantService.createRestaurant(createRestaurantDto);

    return {
      message: 'Restaurant Added Successfully',
      data : result
    };
  }
}
