import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsIn,
  Min,
} from 'class-validator';

export class PaginationDto{
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @IsString()
  name: string = '';

  @IsOptional()
  @IsString()
  city : string 

  @IsOptional()
  @IsString()
  orderBy: string = 'price';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sort: 'ASC' | 'DESC' = 'DESC';
}
