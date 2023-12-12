import { User } from '../user/entities/user.entity';
import { AuthController } from './auth.controller';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: any;
  let user: User;

  beforeAll(async () => {
    user = new User();
    user.fullname = 'John Doe';
    user.email = 'john.doe@example.com';
    user.password = 'Password1!';
  });

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn(),
      register: jest.fn(),
    };

    controller = new AuthController(mockAuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login a user', async () => {
    const token = { access_token: 'testToken' };
    jest.spyOn(mockAuthService, 'login').mockResolvedValue(token);

    expect(await controller.login({ user: {} } as any)).toBe(token);
    expect(mockAuthService.login).toBeCalled();
  });

  it('should verify a user (just for cov)', async () => {
    expect(await controller.verify()).toBe(void 0);
  });

  it('should login a user', async () => {
    const data: CreateUserDTO = {
      fullname: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password1!',
    };
    jest.spyOn(mockAuthService, 'register').mockResolvedValue(user);

    expect(await controller.register(data)).toBe(user);
    expect(mockAuthService.register).toBeCalled();
  });
});
