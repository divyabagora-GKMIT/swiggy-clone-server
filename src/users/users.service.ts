import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { CreateAddressDto } from './dto/create-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async addAddress(createAddressDto: CreateAddressDto, userId: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('User not exist');
      }
      const { cityId, ...rest } = createAddressDto;

      const addressCreated = this.addressRepository.create({
        user,
        city: { id: cityId },
        ...rest,
      });

      return await this.addressRepository.save(addressCreated);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
