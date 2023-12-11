import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MinLength } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @ApiProperty()
  @MinLength(5)
  readonly fullname?: string;
}
