import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { ILike, Repository } from 'typeorm';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,

    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async addItem(createItemDto: CreateItemDto, userId: number) {
    const { restaurantId, name, ...rest } = createItemDto;

    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['user'],
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (restaurant.user.id !== userId) {
      throw new ForbiddenException(
        'You are not allowed to add item in this restaurant',
      );
    }

    const lowerCaseName = createItemDto.name.toLowerCase().trim();
    const existingItem = await this.itemRepository.findOne({
      where: {
        name: lowerCaseName,
        restaurant: restaurant,
      },
    });

    if (existingItem) {
      throw new ConflictException(
        `An item with the name "${name}" already exists in this restaurant.`,
      );
    }

    const newItem = this.itemRepository.create({
      ...rest,
      name: lowerCaseName,
      restaurant: { id: restaurantId },
    });

    return await this.itemRepository.save(newItem);
  }

  async updateItem(
    updateItemDto: UpdateItemDto,
    itemId: number,
    userId: number,
  ) {
    const item = await this.itemRepository.findOne({
      where: { id: itemId },
      relations: ['restaurant']
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    const restaurant = await this.restaurantRepository.findOne({
      where: { id: item.restaurant.id },
      relations: ['user'],
    });

    if (restaurant?.user.id !== userId) {
      throw new ForbiddenException(
        'You are not allowed to add item in this restaurant',
      );
    }

    if (updateItemDto.name) {
      updateItemDto.name = updateItemDto.name.toLowerCase().trim();
    }

    const updatedItem = this.itemRepository.merge(item, updateItemDto);

    return this.itemRepository.save(updatedItem);
  }

  async getItems(name: string) {
    const where = { name: ILike(`%${name}%`) };
    const items = await this.itemRepository.find({
      where,
    });

    return items;
  }
}
