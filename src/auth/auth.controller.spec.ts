import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    login: jest.Mock;
    register: jest.Mock;
    otpVerify: jest.Mock;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
            otpVerify: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login a user', async () => {
    const dto = { email: 'a@test.com', password: '1234' };

    authService.login.mockResolvedValue({
      accessToken: 'jwt-token',
      user: { id: 1, email: dto.email },
    });

    const result = await authService.login(dto);

    expect(authService.login).toHaveBeenCalledWith(dto);
    expect(result.accessToken).toBe('jwt-token');
  });

  it('should register a user', async () => {
    const dto = {
      email: 'new@test.com',
      password: '123456',
      name: 'John',
    };

    authService.register.mockResolvedValue({
      id: 1,
      email: dto.email,
    });

    const result = await authService.register(dto);

    expect(authService.register).toHaveBeenCalledWith(dto);
    expect(result.email).toBe(dto.email);
  });

  it('verify otp', async () => {
    const dto = {
      email: 'new@test.com',
      otp: '1234',
    };
    authService.otpVerify = jest.fn().mockResolvedValue({
      message: 'Log in Successfully',
      accessToken: 'accessToken',
      refereshToken: 'refreshToken',
    });
    const result = await authService.otpVerify(dto);

    expect(authService.otpVerify).toHaveBeenCalledWith(dto);
    expect(result).toEqual({
      message: 'Log in Successfully',
      accessToken: 'accessToken',
      refereshToken: 'refreshToken',
    });
  });
});
