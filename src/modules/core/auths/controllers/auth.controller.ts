import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../../users/dto/user.dto';
import {
  AuthConfirmSignUpDto,
  AuthCredentialsDto,
  AuthResendConfirmationDto,
} from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    if (
      createUserDto.password.length < 8 ||
      !/[a-z]/.test(createUserDto.password) ||
      !/[A-Z]/.test(createUserDto.password) ||
      !/[0-9]/.test(createUserDto.password)
    ) {
      throw new BadRequestException('Password requirements not met.');
    }

    try {
      return await this.authService.registerUser(createUserDto);
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e.message);
    }
  }

  @Post('confirm')
  async confirmSignup(@Body() authConfirm: AuthConfirmSignUpDto) {
    try {
      return await this.authService.confirmSignup(authConfirm);
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e.message);
    }
  }

  @Post('resend')
  async resendConfirmationSignup(@Body() authResend: AuthResendConfirmationDto) {
    try {
      return await this.authService.resendConfirmationSignup(authResend);
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e.message);
    }
  }

  @Post('login')
  async login(@Body() authenticateRequest: AuthCredentialsDto) {
    try {
      return await this.authService.authenticateUser(authenticateRequest);
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e.message);
    }
  }
}
