import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import * as argon2 from 'argon2';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserService: any;
  let mockjwtService: any;
  let user: User;

  beforeAll(async () => {
    user = new User();
    user.fullname = 'John Doe';
    user.email = 'john.doe@example.com';
    user.password = 'Password1!';
  });

  beforeEach(async () => {
    mockUserService = {
      retrieveByEmail: jest.fn(),
      create: jest.fn(),
    };

    mockjwtService = {
      sign: jest.fn(),
    };

    service = new AuthService(mockUserService, mockjwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate a user', async () => {
    const hash: string = await argon2.hash('Password1!');
    const { password, ...result } = user;

    jest
      .spyOn(mockUserService, 'retrieveByEmail')
      .mockResolvedValue({ ...user, password: hash });

    expect(await service.validateUser(user.email, user.password)).toStrictEqual(
      result,
    );
  });

  it('should NOT validate a user (wrong password)', async () => {
    const hash: string = await argon2.hash('Password');

    jest
      .spyOn(mockUserService, 'retrieveByEmail')
      .mockResolvedValue({ ...user, password: hash });

    try {
      await service.validateUser(user.email, user.password);
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('should NOT validate a user (not exist)', async () => {
    jest.spyOn(mockUserService, 'retrieveByEmail').mockResolvedValue(null);

    try {
      await service.validateUser(user.email, user.password);
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('should register a user', async () => {
    const data: CreateUserDTO = {
      fullname: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password1!',
    };

    jest.spyOn(mockUserService, 'retrieveByEmail').mockResolvedValue(null);
    jest.spyOn(mockUserService, 'create').mockResolvedValue(user);

    expect(await service.register(data)).toBe(user);
  });

  it('should NOT register a user (already exist)', async () => {
    const hash: string = await argon2.hash('Password');
    const data: CreateUserDTO = {
      fullname: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password1!',
    };

    jest
      .spyOn(mockUserService, 'retrieveByEmail')
      .mockResolvedValue({ ...user, password: hash });
    jest.spyOn(mockUserService, 'create').mockResolvedValue(user);

    try {
      expect(await service.register(data));
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
    }
  });

  it('should login a user', async () => {
    const hash: string = await argon2.hash('Password');
    jest
      .spyOn(mockUserService, 'retrieveByEmail')
      .mockResolvedValue({ ...user, password: hash });
    jest.spyOn(mockjwtService, 'sign').mockResolvedValue('token');

    await service.login({ username: user.email, password: user.password });
    expect(mockjwtService.sign).toBeCalled();
  });
});
