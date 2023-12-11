import { UserService } from './user.service';
import { EntityNotFoundError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let repository: any;
  let user: User;

  beforeAll(async () => {
    user = new User();
    user.fullname = 'John Doe';
    user.email = 'john.doe@example.com';
    user.password = 'Password1!';
  });

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      delete: jest.fn(),
      findOne: jest.fn(),
      findOneOrFail: jest.fn(),
      createQueryBuilder: jest.fn(),
      remove: jest.fn(),
    };

    service = new UserService(repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const data: CreateUserDTO = {
      fullname: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password1!',
    };

    jest.spyOn(repository, 'save');
    jest.spyOn(repository, 'create').mockResolvedValue(user);

    expect(await service.create(data)).toBe(user);
    expect(repository.save).toBeCalled();
  });

  it('should find a user by id', async () => {
    jest.spyOn(repository, 'findOneOrFail').mockResolvedValue(user);
    expect(await service.findOne(1)).toBe(user);
  });

  it('should not find a user by id', async () => {
    jest.spyOn(repository, 'findOneOrFail').mockImplementation(() => {
      throw new EntityNotFoundError(User, 1);
    });

    try {
      await service.findOne(1);
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(EntityNotFoundError);
    }
  });

  it('should update a user', async () => {
    const data: UpdateUserDTO = {
      fullname: 'Giannis Gianni',
    };

    jest.spyOn(repository, 'findOneOrFail').mockResolvedValue(user);
    jest
      .spyOn(repository, 'merge')
      .mockImplementation((obj1: any, obj2: any) => ({ ...obj1, ...obj2 }));

    jest
      .spyOn(repository, 'save')
      .mockResolvedValue({ ...user, fullname: data.fullname });

    expect(await service.update(1, data)).toStrictEqual({
      ...user,
      fullname: data.fullname,
    });
    expect(repository.save).toBeCalled();
  });

  it('should NOT update a user if does not exist', async () => {
    const data: UpdateUserDTO = {
      fullname: 'Giannis Gianni',
    };
    jest.spyOn(repository, 'findOneOrFail').mockImplementation(() => {
      throw new EntityNotFoundError(User, 1);
    });

    try {
      await service.update(1, data);
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(EntityNotFoundError);
    }
  });

  it('should remove a user', async () => {
    jest.spyOn(repository, 'findOneOrFail').mockResolvedValue(user);

    await service.remove(1);
    expect(repository.findOneOrFail).toBeCalledWith({ where: { id: 1 } });
    expect(repository.remove).toBeCalledWith(user);
  });

  it('should NOT remove a user if does not exist', async () => {
    jest.spyOn(repository, 'findOneOrFail').mockImplementation(() => {
      throw new EntityNotFoundError(User, 1);
    });

    try {
      await service.remove(1);
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(EntityNotFoundError);
    }
  });

  it('should retrieve user by email', async () => {
    const queryBuilder = {
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockReturnThis(),
    };
    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder);
    jest.spyOn(queryBuilder, 'getOne').mockResolvedValue(user);

    expect(await service.retrieveByEmail('john.doe@example.com')).toBe(user);
  });
});
