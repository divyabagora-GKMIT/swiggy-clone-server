import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemsService } from './items.service';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('items')
export class ItemsController {

    constructor(
        private readonly itemsService: ItemsService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post()
    async addItem(@Body() createItemDto: CreateItemDto, @Req() req){
        const userId = req.user.userId
        const result = await this.itemsService.addItem(createItemDto, +userId);

        return {
            message: "Item Added Successfully",
            data: result
        }
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateItem(@Body() updateItemDto: UpdateItemDto, @Param('id' ,new ParseIntPipe()) id :string, @Req() req){
        const userId = req.user.userId;
        const result = await this.itemsService.updateItem(updateItemDto, +id, +userId);
        return {
            message : "Item details updated successfully",
            data : result
        }
    }

    @Get()
    async getItems (@Query('name') name : string){
        const items = await this.itemsService.getItems(name);

        if (!items.length){
            return {
                message : "No Items found for this name"
            }
        }

        return {
            message : "Items fetch successfully",
            data: items
        }
    }

}
