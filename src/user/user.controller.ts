import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserRole } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { ResponseDto } from './dto/reponse.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ReponseUserDto } from './dto/user-response.dto';

@Controller('users')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(RolesGuard)  
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary : "GET all user"})
  @ApiOkResponse({
    description: "successfully find all user",
    type: User,
    isArray: true
  })
  @ApiNotFoundResponse({
    description: "User not found"
  })
  @ApiBadRequestResponse({
    description: "Invalid data provided"
  })
  async findAll(): Promise<ResponseDto<Partial<User>[]>> {
    const users = await this.userService.findAll();
    return new ResponseDto(
      HttpStatus.OK,
      'Users fetched successfully',
      users,
    );
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.VIEWER)
  @Roles(UserRole.VIEWER, UserRole.EDITOR, UserRole.ADMIN)
  @ApiOperation({ summary : "Find user by ID"})
  @ApiOkResponse({
    description: "successfully find user by ID",
    type: User
  })
  @ApiNotFoundResponse({
    description: "User not found"
  })
  @ApiBadRequestResponse({
    description: "Invalid data provided"
  })
  async findOne(@Param('id') id: string): Promise<ResponseDto<Partial<User>>> {
    const user = await this.userService.findOne(id);
    return new ResponseDto(
      HttpStatus.OK,
      'User fetched successfully',
      user,
    );
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.EDITOR, UserRole.ADMIN)
  @ApiOperation({ summary : "Update user by ID"})
  @ApiOkResponse({
    description: "successfully updated user by ID",
    type: UpdateUserDto
  })
  @ApiNotFoundResponse({
    description: "User not found"
  })
  @ApiBadRequestResponse({
    description: "Invalid data provided"
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<ResponseDto<ReponseUserDto>> {
    const user = await this.userService.update(id, updateUserDto);
    return new ResponseDto(
      HttpStatus.OK,
      'User detail updated successfully',
      user,
    );
  }

  @Put('role/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary : "Add role to user"})
  @ApiOkResponse({
    description: "successfully added role to user By ID",
    type: UpdateRoleDto
  })
  @ApiNotFoundResponse({
    description: "User not found"
  })
  @ApiBadRequestResponse({
    description: "Invalid data provided"
  })
  async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<ResponseDto<ReponseUserDto>> {
    const user = await this.userService.updateRole(id, updateRoleDto.roles);
    return new ResponseDto(
      HttpStatus.OK,
      'User role updated successfully',
      user,
    );
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary : "Remove user"})
  @ApiOkResponse({
    description: "successfully deleted user by ID",
    type: null
  })
  @ApiNotFoundResponse({
    description: "User not found"
  })
  @ApiBadRequestResponse({
    description: "Invalid data provided"
  })
  async remove(@Param('id') id: string): Promise<ResponseDto<null>> {
    await this.userService.remove(id);
    return new ResponseDto(
      HttpStatus.OK,
      `User with ID ${id} deleted successfully`,
      null,
    );
  }
}
