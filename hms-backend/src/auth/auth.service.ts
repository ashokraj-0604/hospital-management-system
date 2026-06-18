import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
  // 1. Find user
  const user = await this.usersRepo.findOne({ where: { email: dto.email } });
  if (!user) throw new UnauthorizedException('Invalid credentials');

  // 2. Check password
  const passwordMatch = await bcrypt.compare(dto.password, user.password);
  if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

  // 3. Check active
  if (!user.isActive) throw new UnauthorizedException('Account is disabled');

  // 4. Generate tokens
  const tokens = await this.generateTokens(user);

  // 5. Save hashed refresh token
  const hashedRefresh = await bcrypt.hash(tokens.refresh_token, 10);
  await this.usersRepo.update(user.id, { refreshToken: hashedRefresh });

  // Return shape matching frontend LoginResponse type exactly
  return {
    requires_mfa: false,
    tokens: {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: 900, // 15 minutes
    },
    user: {
      user_id: user.id,
      email: user.email,
      full_name: user.name,
      role: user.role,
      hospital_id: user.hospitalId ?? '',
      is_mfa_enabled: false,
    },
  };
}

  async refresh(refreshToken: string) {
    try {
      // 1. Verify token
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });

      // 2. Find user
      const user = await this.usersRepo.findOne({ where: { id: payload.sub } });
      if (!user || !user.refreshToken) throw new UnauthorizedException();

      // 3. Compare stored hash
      const tokenMatch = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!tokenMatch) throw new UnauthorizedException();

      // 4. Generate new tokens
      const tokens = await this.generateTokens(user);
      const hashedRefresh = await bcrypt.hash(tokens.refresh_token, 10);
      await this.usersRepo.update(user.id, { refreshToken: hashedRefresh });

      return { data: tokens };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  async forgotPassword(email: string) {
  // 1. Find user — always return same message to prevent email enumeration
  const user = await this.usersRepo.findOne({ where: { email } });
  if (!user) {
    return { message: 'If that email exists, a reset link has been sent.' };
  }

  // 2. Generate reset token
  const resetToken = Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2) +
    Date.now().toString(36);

  // 3. Hash and save token with 1 hour expiry
  const hashedToken = await bcrypt.hash(resetToken, 10);
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await this.usersRepo.update(user.id, {
    passwordResetToken: hashedToken,
    passwordResetExpiry: expiry,
  });

  // 4. TODO: Send email with reset link
  // For now log the token — replace with real email service later
  console.log(`
    ─────────────────────────────────────────
    PASSWORD RESET LINK (dev only)
    Email: ${email}
    Token: ${resetToken}
    Link:  http://localhost:3000/login/reset-password?token=${resetToken}&email=${email}
    ─────────────────────────────────────────
  `);

  return { message: 'If that email exists, a reset link has been sent.' };
}

async resetPassword(dto: { token: string; new_password: string; confirm_password: string; email: string }) {
  // 1. Check passwords match
  if (dto.new_password !== dto.confirm_password) {
    throw new UnauthorizedException('Passwords do not match');
  }

  // 2. Find user by email
  const user = await this.usersRepo.findOne({ where: { email: dto.email } });
  if (!user || !user.passwordResetToken || !user.passwordResetExpiry) {
    throw new UnauthorizedException('Invalid or expired reset token');
  }

  // 3. Check expiry
  if (new Date() > user.passwordResetExpiry) {
    throw new UnauthorizedException('Reset token has expired. Please request a new one.');
  }

  // 4. Verify token
  const tokenMatch = await bcrypt.compare(dto.token, user.passwordResetToken);
  if (!tokenMatch) {
    throw new UnauthorizedException('Invalid or expired reset token');
  }

  // 5. Hash new password and clear reset token
  const hashedPassword = await bcrypt.hash(dto.new_password, 10);
  await this.usersRepo.update(user.id, {
    password: hashedPassword,
    passwordResetToken: null,
    passwordResetExpiry: null,
    refreshToken: null, // force re-login everywhere
  });

  return { message: 'Password reset successfully. Please login with your new password.' };
}

  async logout(userId: string) {
    await this.usersRepo.update(userId, { refreshToken: null });
  }

  private async generateTokens(user: User) {
  const payload = { sub: user.id, email: user.email, role: user.role };

  const [access_token, refresh_token] = await Promise.all([
    this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_EXPIRY'),
    }),
    this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRY'),
    }),
  ]);

    return { access_token, refresh_token };
  }
}