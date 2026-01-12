import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateItemDto } from './create-item.dto';

export class UpdateItemDto extends PartialType(
  PickType(CreateItemDto, ['name', 'price', 'description'] as const),
) {}