import { Body, Controller, Post } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {

    constructor(
        private readonly itemsService: ItemsService
    ){}
    @Post()
    async addItem(@Body() createItemDto: CreateItemDto){
        const result = await this.itemsService.addItem(createItemDto);

        return {
            message: "Item Added Successfully",
            data: result
        }
    }
}
