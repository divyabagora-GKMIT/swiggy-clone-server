import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateOrderRatingDto } from './dto/rating.dto';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('ratings')
export class RatingsController {
    constructor(
        private readonly ratingsService: RatingsService
    ) {}
    @UseGuards(JwtAuthGuard)
    @Post()
    async rateOrder(@Body() createOrderRatingDto: CreateOrderRatingDto, @Req() req){
        const userId = req.user.userId
        await this.ratingsService.rateOrder(createOrderRatingDto,+userId);

        return {
            message : "Rating submitted successfully"
        }
    }
}
