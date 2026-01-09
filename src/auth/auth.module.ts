import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/entities/user-role.entity';
import { Role } from 'src/roles/entities/role.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole, Role])],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
