import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDTO): Promise<User> {
    const user = this.userRepository.create(data);
    await this.userRepository.save(user);
    return user;
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOneOrFail({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDTO): Promise<User> {
    const user = await this.userRepository.findOneOrFail({ where: { id } });
    this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOneOrFail({ where: { id } });
    await this.userRepository.remove(user);
  }

  async retrieveByEmail(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder()
      .where('LOWER(email) = :email', { email: email.toLowerCase() })
      .getOne();
  }
}
