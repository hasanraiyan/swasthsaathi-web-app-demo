import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'SwasthSaathi API',
      timestamp: new Date().toISOString(),
    };
  }
}
