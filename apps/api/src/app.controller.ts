import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }

  @Get()
  getRoot() {
    return {
      message: 'Welcome to SwasthSaathi API',
      documentation: '/docs',
      health: '/health',
    };
  }
}
