import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseDto } from 'src/user/dto/reponse.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary : "Register new user"})
  @ApiOkResponse({
    description: "successfully create new user",
    type: ResponseDto
  })
  async register(@Body() registerDto: RegisterDto) {
    const users = await this.authService.register(registerDto);
    return new ResponseDto(
      HttpStatus.OK,
      'Users Created successfully',
      users,
    );
  }

  @Post('login')
  @ApiOperation({ summary : "Logged in user"})
  @ApiOkResponse({
    description: "successfully logged in user",
    type: LoginDto
  })
  @ApiNotFoundResponse({
    description: "User not found"
  })
  @ApiBadRequestResponse({
    description: "Invalid data provided"
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const users = await this.authService.login(loginDto);
    return new ResponseDto(
      HttpStatus.OK,
      'Users Logged in successfully',
      users,
    );
  }
}
