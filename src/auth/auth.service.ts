import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'users/services/users.service';
import { RequestUser } from './auth.interfaces';
import { omit } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<RequestUser> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email '${email}' is not found!`);
    }
    if (user.password === pass) {
      const result = omit(user, ['password']);
      return result;
    }
    return null;
  }

  async login(user: RequestUser) {
    const payload = {
      ...user,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
