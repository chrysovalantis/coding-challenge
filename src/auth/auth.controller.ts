import {
  Controller,
  Post,
  UseGuards,
  Body,
  Req,
  HttpCode,
  Get,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Req() req: Request): Promise<{ access_token: string }> {
    return this.authService.login(req.user as any);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  @ApiOperation({ summary: 'Verify user' })
  async verify(): Promise<void> {
    return;
  }

  @Post('register')
  @ApiCreatedResponse({ description: 'Created' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({ summary: 'Register' })
  async register(@Body() data: CreateUserDTO): Promise<User> {
    return this.authService.register(data);
  }
}
