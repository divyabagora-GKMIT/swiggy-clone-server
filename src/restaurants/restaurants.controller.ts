import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createRestaurant(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @Req() req,
  ) {
    const userId = req.user.userId;
    const result = await this.restaurantService.createRestaurant(
      +userId,
      createRestaurantDto,
    );

    return {
      message: 'Restaurant Added Successfully',
      data: result,
    };
  }

  @Get()
  async viewRestaurants(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('name') name: string,
  ) {
    return this.restaurantService.viewRestaurants(+page, +limit, name);
  }

  @Get(':id')
  async viewRestaurantItems(
    @Param('id', new ParseIntPipe()) id: number,
    @Query('page') page: string ,
    @Query('limit') limit: string ,
    @Query('name') name: string ,
    @Query('order') order:string 
  ) {
    return this.restaurantService.viewRestaurantItems(id,+page,+limit,name,order);
  }
}
