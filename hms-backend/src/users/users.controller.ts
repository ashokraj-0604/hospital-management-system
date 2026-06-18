import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
  ) {
    return this.usersService.findAll({ search, role, status });
  }
}