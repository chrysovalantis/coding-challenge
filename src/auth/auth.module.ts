import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule, PassportModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
