import { 
  IsEnum, 
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  IsString, 
  IsUrl, 
  MaxLength, 
  Min 
} from 'class-validator';
import { ItemClassification } from '../entities/item.entity'; // Adjust path as needed

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNotEmpty()
  @IsEnum(ItemClassification, {
    message: 'classification must be either VEG or NON-VEG',
  })
  classification: ItemClassification;
}