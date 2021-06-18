import { Controller, Get, Req, Post, UseGuards, Res } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() req, @Res({ passthrough: true }) response: Response) {
    const jwt = await this.authService.login(req.user);
    response.cookie('jwt', jwt.access_token);
    return {
      user: req.user,
      jwt: jwt,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Req() request: Request) {
    const currentUser = request.user;
    return currentUser;
  }
}
