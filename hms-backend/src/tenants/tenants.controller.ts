import { Controller, Get, Query } from '@nestjs/common';
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get('branding')
  async getBranding(@Query('subdomain') subdomain?: string) {
    return this.tenantsService.getBranding(subdomain);
  }
}
