import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateItemDto } from 'src/items/dto/update-item.dto';
import { ItemsService } from 'src/items/items.service';
import { CreateItemDto } from 'src/items/dto/create-item.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private readonly restaurantService: RestaurantsService,
    private readonly itemsService : ItemsService

  ) {}

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
  async viewRestaurants(@Query() query: PaginationDto) {
    const { page, limit, name, city } = query;
    return this.restaurantService.viewRestaurants(+page, +limit, name, city);
  }

  @Get(':id/items')
  async viewRestaurantItems(
    @Param('id', new ParseIntPipe()) id: number,
    @Query() query: PaginationDto,
  ) {
    const { page, limit, name, orderBy, sort } = query;
    return this.restaurantService.viewRestaurantItems(
      id,
      +page,
      +limit,
      name,
      orderBy,
      sort,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/items')
  async addItem(@Body() createItemDto: CreateItemDto, @Req() req , @Param('id') id : string) {
    const userId = req.user.userId;
    const result = await this.itemsService.addItem(createItemDto, +userId, +id);

    return {
      message: 'Item Added Successfully',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':restaurantId/items/:itemId')
  async updateItem(
    @Body() updateItemDto: UpdateItemDto,
    @Param('restaurantId', new ParseIntPipe()) restaurantId: string,
    @Param ('itemId' , new ParseIntPipe()) itemId : string,
    @Req() req,
  ) {
    const userId = req.user.userId;
    const result = await this.itemsService.updateItem(
      updateItemDto,
      +itemId,
      +userId,
      +restaurantId
    );
    return {
      message: 'Item details updated successfully',
      data: result,
    };
  }
}
