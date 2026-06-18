import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from '../src/auth/auth.service';
import { LoginDto } from '../src/auth/dto/login.dto';
import { RefreshDto } from '../src/auth/dto/refresh.dto';
import { ForgotPasswordDto } from '../src/auth/dto/forgot-password.dto';
import { ResetPasswordDto } from '../src/auth/dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(200)
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refresh_token);
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Body() body: { userId: string }) {
    return this.authService.logout(body.userId);
  }

  @Post('forgot-password')
  @HttpCode(200)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @HttpCode(200)
  resetPassword(@Body() body: ResetPasswordDto & { email: string }) {
    return this.authService.resetPassword(body);
  }
}