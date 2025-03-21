import { IsNotEmpty } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'role',
    required: true,
    isArray: true,
    enum: UserRole,
    example: ['admin', 'editor', 'viewer'],
  })
  @IsNotEmpty()
  roles: UserRole[];
}
