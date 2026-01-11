import { IsInt, IsPositive, IsNotEmpty } from 'class-validator';

export class AddCartItemDto {
  @IsInt()
  @IsNotEmpty()
  itemId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}