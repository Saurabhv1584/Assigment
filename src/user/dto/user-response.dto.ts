import { IsEmail, IsNotEmpty, IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReponseUserDto {
  @ApiProperty({
    description: 'email',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'first name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'last name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({
    description: 'role',
    default: UserRole.VIEWER
  })
  @IsArray()
  @IsEnum(UserRole, { each: true }) 
  @IsOptional()
  roles?: UserRole[] = [UserRole.VIEWER]; 
}
