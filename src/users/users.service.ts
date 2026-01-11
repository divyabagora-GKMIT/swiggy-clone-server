import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateAddressDto } from './dto/create-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Address)
        private readonly addressRepository : Repository<Address>,
        @InjectRepository(User)
        private readonly userRepository : Repository<User>
    ){}
    async addAddress(createAddressDto : CreateAddressDto,  userId : number){
        const user = await  this.userRepository.findOne({
           where: {id : userId}
        });
        console.log(user);
        if (!user){
            throw new NotFoundException('User not exist') 
        }
        const {cityId , ...rest} = createAddressDto;
        
        const addressCreated = this.addressRepository.create({
            user,
            city: {id : cityId},
            ...rest
        });

        await this.addressRepository.save(addressCreated);
    }
}
