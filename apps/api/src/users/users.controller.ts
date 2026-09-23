import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(ClerkAuthGuard)
  async getProfile(@CurrentUser() user: any) {
    const dbUser = await this.usersService.findByClerkId(user.clerkId);
    return {
      success: true,
      data: dbUser || user,
    };
  }

  @Post('sync')
  @UseGuards(ClerkAuthGuard)
  async syncUser(
    @CurrentUser() user: any,
    @Body() body: { email: string; name: string; avatarUrl?: string },
  ) {
    const synced = await this.usersService.syncClerkUser({
      clerkId: user.clerkId,
      email: body.email,
      name: body.name,
      avatarUrl: body.avatarUrl,
    });
    return {
      success: true,
      data: synced,
    };
  }
}
