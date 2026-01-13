import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RateItemDto {
  @IsInt()
  itemId: number;

  @IsNumber()
  @Min(1)
  rating: number;

}

export class CreateOrderRatingDto {
  @IsInt()
  orderId: number;

  @IsNumber()
  @Min(1)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RateItemDto)
  ratings?: RateItemDto[];
}
