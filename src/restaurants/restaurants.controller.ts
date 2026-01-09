import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Post()
  async createRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
    const result =
      await this.restaurantService.createRestaurant(createRestaurantDto);

    return {
      message: 'Restaurant Added Successfully',
      data: result,
    };
  }

  @Get()
  async viewRestaurants(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.restaurantService.viewRestaurants(page,limit);
  }

  @Get(':id')
  async viewRestaurantItems(@Param('id') id : number){
    return this.restaurantService.viewRestaurantItems(id);
  }
}
