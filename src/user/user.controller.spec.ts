import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { EntityNotFoundError } from 'typeorm';
import { CanActivate } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: any;
  let user: User;

  beforeAll(async () => {
    user = new User();
    user.fullname = 'John Doe';
    user.email = 'john.doe@example.com';
    user.password = 'Password1!';
  });

  beforeEach(async () => {
    mockUserService = {
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn,
    };

    controller = new UserController(mockUserService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find a user', async () => {
    jest.spyOn(mockUserService, 'findOne').mockResolvedValue(user);

    expect(await controller.findOne(1)).toBe(user);
    expect(mockUserService.findOne).toBeCalled();
  });

  it('should NOT find a user', async () => {
    jest.spyOn(mockUserService, 'findOne').mockImplementation(() => {
      throw new EntityNotFoundError(User, 1);
    });
    try {
      await controller.findOne(1);
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(EntityNotFoundError);
    }
  });

  it('should NOT update a user', async () => {
    jest.spyOn(mockUserService, 'update').mockImplementation(() => {
      throw new EntityNotFoundError(User, 1);
    });
    try {
      await controller.update('1', { fullname: 'Giannis Gian' });
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(EntityNotFoundError);
    }
  });
  it('should update a user', async () => {
    jest
      .spyOn(mockUserService, 'update')
      .mockResolvedValue({ ...user, fullName: 'Giannis Gian' });

    expect(
      await controller.update('1', { fullname: 'Giannis Gian' }),
    ).toStrictEqual({
      ...user,
      fullName: 'Giannis Gian',
    });
    expect(mockUserService.update).toBeCalled();
  });
});
