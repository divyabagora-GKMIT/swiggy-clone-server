import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { UserRole } from 'src/users/entities/user-role.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { randomInt } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async createUser(registerUserDto: RegisterUserDto) {
    const userExist = await this.userRepository.findOne({
      where: { email: registerUserDto.email },
    });

    if (userExist) {
      throw new ConflictException('User already exists');
    }

    const roleExist = await this.roleRepository.findOne({
      where: { id: registerUserDto.roleId },
    });

    if (!roleExist) {
      throw new NotFoundException('Role not exists');
    }

    const createdUser = this.userRepository.create({
      name: registerUserDto.name,
      email: registerUserDto.email,
      phone: registerUserDto.phone,
    });

    await this.userRepository.save(createdUser);

    const userRole = this.userRoleRepository.create({
      user: createdUser,
      role: roleExist,
    });

    await this.userRoleRepository.save(userRole);
  }

  async loginUser(loginDto: LoginDto) {
    const userExist = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!userExist) {
      throw new NotFoundException('User not exist');
    }

    const otp = randomInt(1000, 9999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  }
}
