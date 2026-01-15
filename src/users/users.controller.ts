import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService : UsersService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('addresses')
    async addAddress (@Body() createAddressDto: CreateAddressDto, @Req() req) {
        const userId = req.user.userId;
        console.log(userId)
        const result = await this.usersService.addAddress(createAddressDto,+userId);

        return {
            message : "Address added successfully",
            data : result
        }
    }   
}
