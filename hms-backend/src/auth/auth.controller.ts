import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refresh_token);
  }

  @Post('logout')
  logout(@Body() body: { userId: string }) {
    return this.authService.logout(body.userId);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: { email: string }) {
    // TODO: send reset email
    return { message: 'If that email exists, a reset link has been sent.' };
  }
}