import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { UserRole } from 'src/users/entities/user-role.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { randomInt } from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { type Cache } from 'cache-manager';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { config } from 'process';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly mailService: MailerService,

    private jwtService: JwtService,

    private configService: ConfigService,
  ) {}

  async createUser(registerUserDto: RegisterUserDto): Promise<void> {
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

  async loginUser(loginDto: LoginDto): Promise<void> {
    const userExist = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!userExist) {
      throw new NotFoundException('User not exist');
    }

    const otp = randomInt(1000, 9999).toString();
    await this.cacheService.set(
      loginDto.email,
      otp.toString(),
      this.configService.get<number>('CACHE_TTL'),
    );

    const message = otp;
    await this.mailService.sendMail({
      from: 'divybagora1122@gmail.com',
      to: loginDto.email,
      subject: `OTP for verification`,
      text: message,
    });
  }

  async optVerify(verifyOtpDto: VerifyOtpDto) {
    const optGenerated = await this.cacheService.get(verifyOtpDto.email);

    const user = await this.userRepository.findOne({
      where: { email: verifyOtpDto.email },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) {
      throw new NotFoundException();
    }

    if (verifyOtpDto.otp !== optGenerated) {
      throw new UnauthorizedException('otp incorrect');
    }

    const roleId = user?.userRoles[0].role.id;
    const { accessToken, refereshToken } = await this.createToken(
      user?.id.toString(),
      roleId?.toString(),
    );

    return {
      accessToken,
      refereshToken,
    };
  }

  async createToken(userId: string, roleId: string) {
    const payload = {
      userId,
      roleId,
    };

    const [accessToken, refereshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.getOrThrow<number>('ACCESS_TOKEN_EXPIRE'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.getOrThrow<number>(
          'REFRESH_TOKEN_EXPIRE',
        ),
      }),
    ]);

    return {
      accessToken,
      refereshToken,
    };
  }
}
