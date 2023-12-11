import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<Partial<User>> {
    const user = await this.userService.retrieveByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email does not exist');
    }
    // Check that password entered is correct
    const verified = (await argon2.verify(user.password, pass)) as boolean;
    if (!verified) {
      throw new UnauthorizedException('Invalid password');
    }
    const { password, ...result } = user;
    return result;
  }

  async register(userData: CreateUserDTO): Promise<User> {
    const hash: string = await argon2.hash(userData.password);
    const data = { ...userData, password: hash };

    const alreadyExists = await this.userService.retrieveByEmail(
      userData.email,
    );
    if (alreadyExists) {
      throw new ForbiddenException('User already exists!');
    }
    return this.userService.create(data);
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
