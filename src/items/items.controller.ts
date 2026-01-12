import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemsService } from './items.service';
import { UpdateItemDto } from './dto/update-item.dto';

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

    @Patch(':id')
    async updateItem(@Body() updateItemDto: UpdateItemDto, @Param('id') id :string){
        const result = await this.itemsService.updateItem(updateItemDto, +id);
        return {
            message : "Item details updated successfully",
            data : result
        }
    }
}
