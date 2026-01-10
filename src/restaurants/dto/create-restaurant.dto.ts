import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { RestaurantClassification } from '../entities/restaurant.entity';

export class CreateRestaurantDto {
  @IsInt()
  userId: number;

  @IsInt()
  cityId: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  pincode: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  name: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  image?: string;

  @IsEnum(RestaurantClassification)
  classification: RestaurantClassification;

  @IsOptional()
  @IsNumber()
  latitude: number;

  @IsOptional()
  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsNumber()
  radius?: number;
}
