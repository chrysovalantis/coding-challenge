import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDTO } from './create-user.dto';
import { IsOptional } from 'class-validator';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @IsOptional()
  @ApiProperty()
  readonly fullName?: string;
}
