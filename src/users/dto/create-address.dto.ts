import { Exclude } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsPostalCode,
} from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  @MaxLength(255)
  address: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @IsPostalCode('IN', { message: 'Please enter a valid pincode' })
  pincode: string;

  @IsNumber()
  @IsNotEmpty({ message: 'City is required' })
  cityId: number;
 
}
