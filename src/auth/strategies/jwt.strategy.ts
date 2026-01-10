import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  /**
   * This method is called automatically after the JWT is successfully verified.
   * @param payload The decoded JSON object from the JWT (userId, roleId, etc.)
   */
  async validate(payload: any) {
    return {
      userId: payload.userId,
      roleId: payload.roleId,
    };
  }
}
