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
    const email = this.normalizeEmail(dto.email);

    // 1. Find user
    const user = await this.usersRepo
      .createQueryBuilder('user')
      .where('LOWER(TRIM(user.email)) = :email', { email })
      .getOne();
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // 2. Check password
    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    // 3. Check active
    if (!user.isActive) throw new UnauthorizedException('Account is disabled');

    // 4. Generate tokens (hospitalId now embedded in JWT payload)
    const tokens = await this.generateTokens(user);

    // 5. Save hashed refresh token
    const hashedRefresh = await bcrypt.hash(tokens.refresh_token, 10);
    await this.usersRepo.update(user.id, { refreshToken: hashedRefresh });

    // 6. Determine post-login redirect based on role
    //    SUPER_ADMIN has no hospitalId — goes to platform dashboard
    //    HOSPITAL_ADMIN goes to their tenant dashboard
    const redirect =
      user.role === 'SUPER_ADMIN'
        ? '/super-admin/dashboard'
        : '/hospital-admin';   // ← matches the actual Next.js route (no dynamic :hospitalId segment — tenant scoping is done via JWT, not the URL)

    return {
      requires_mfa: false,
      redirect,                          // ← frontend reads this and calls router.push()
      tokens: {
        access_token:  tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in:    900,              // 15 minutes
      },
      user: {
        user_id:        user.id,
        email:          user.email,
        full_name:      user.name,
        role:           user.role,
        hospital_id:    user.hospitalId ?? '',
        is_mfa_enabled: false,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersRepo.findOne({ where: { id: payload.sub } });
      if (!user || !user.refreshToken) throw new UnauthorizedException();

      const tokenMatch = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!tokenMatch) throw new UnauthorizedException();

      const tokens = await this.generateTokens(user);
      const hashedRefresh = await bcrypt.hash(tokens.refresh_token, 10);
      await this.usersRepo.update(user.id, { refreshToken: hashedRefresh });

      return { data: tokens };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(email: string) {
    const normalizedEmail = this.normalizeEmail(email);
    const user = await this.usersRepo
      .createQueryBuilder('user')
      .where('LOWER(TRIM(user.email)) = :email', { email: normalizedEmail })
      .getOne();
    if (!user) {
      return { message: 'If that email exists, a reset link has been sent.' };
    }

    const resetToken =
      Math.random().toString(36).slice(2) +
      Math.random().toString(36).slice(2) +
      Date.now().toString(36);

    const hashedToken = await bcrypt.hash(resetToken, 10);
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await this.usersRepo.update(user.id, {
      passwordResetToken:  hashedToken,
      passwordResetExpiry: expiry,
    });

    console.log(`
    ─────────────────────────────────────────
    PASSWORD RESET LINK (dev only)
    Email: ${normalizedEmail}
    Token: ${resetToken}
    Link:  http://localhost:3000/login/reset-password?token=${resetToken}&email=${normalizedEmail}
    ─────────────────────────────────────────
    `);

    return { message: 'If that email exists, a reset link has been sent.' };
  }

  async resetPassword(dto: {
    token: string;
    new_password: string;
    confirm_password: string;
    email: string;
  }) {
    if (dto.new_password !== dto.confirm_password) {
      throw new UnauthorizedException('Passwords do not match');
    }

    const email = this.normalizeEmail(dto.email);
    const user = await this.usersRepo
      .createQueryBuilder('user')
      .where('LOWER(TRIM(user.email)) = :email', { email })
      .getOne();
    if (!user || !user.passwordResetToken || !user.passwordResetExpiry) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    if (new Date() > user.passwordResetExpiry) {
      throw new UnauthorizedException(
        'Reset token has expired. Please request a new one.',
      );
    }

    const tokenMatch = await bcrypt.compare(dto.token, user.passwordResetToken);
    if (!tokenMatch) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(dto.new_password, 10);
    await this.usersRepo.update(user.id, {
      password:            hashedPassword,
      passwordResetToken:  null,
      passwordResetExpiry: null,
      refreshToken:        null,
    });

    return {
      message: 'Password reset successfully. Please login with your new password.',
    };
  }

  async logout(userId: string) {
    await this.usersRepo.update(userId, { refreshToken: null });
  }

  // ── Private ────────────────────────────────────────────────────────────────

  private async generateTokens(user: User) {
    // hospitalId is included so TenantContextMiddleware can scope every
    // subsequent request without a DB lookup on each call.
    // SUPER_ADMIN has hospitalId = null — that is correct and expected.
    const payload = {
      sub:        user.id,
      email:      user.email,
      role:       user.role,
      hospitalId: user.hospitalId,  // ← only change from your original
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret:    this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRY'),
      }),
      this.jwtService.signAsync(payload, {
        secret:    this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRY'),
      }),
    ]);

    return { access_token, refresh_token };
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}