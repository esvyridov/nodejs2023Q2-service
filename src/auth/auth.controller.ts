import { Body, Controller, HttpStatus, Post, Res, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from 'src/logging/logging.interceptor';
import { LoggingService } from 'src/logging/logging.service';
import { SignupDto } from './dto/signup-dto';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login-dto';
import { RefreshDto } from './dto/refresh-dto';
import { CRYPT_SALT } from './auth.constants';

@ApiTags('Auth')
@UseInterceptors(new LoggingInterceptor('Auth', new LoggingService()))
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService, private readonly jwtService: JwtService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto, @Res() res: Response) {
    const { login, password } = signupDto;
    const errors: Partial<Record<keyof SignupDto, string>> = {};

    if (
      typeof login !== 'string'
    ) {
      errors.login = 'Field "login" is not provided or invalid';
    }

    if (
      typeof password !== 'string'
    ) {
      errors.password = 'Field "password" is not provided or invalid';
    }

    if (Object.keys(errors).length !== 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        errors,
      });
    }

    const user = await this.userService.create({
      login,
      password,
    });

    const payload = {
      userId: user.id,
      login: user.login,
    };

    return res
      .status(HttpStatus.CREATED)
      .json({
        accessToken: await this.jwtService.signAsync(payload),
        refreshToken: await this.jwtService.signAsync(payload),
        ...this.userService.formatUser(user)
      });
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { login, password } = loginDto;
    const errors: Partial<Record<keyof LoginDto, string>> = {};

    if (
      typeof login !== 'string'
    ) {
      errors.login = 'Field "login" is not provided or invalid';
    }

    if (
      typeof password !== 'string'
    ) {
      errors.password = 'Field "password" is not provided or invalid';
    }

    if (Object.keys(errors).length !== 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        errors,
      });
    }

    const user = await this.userService.findOneByLogin(login);

    if (!user) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: 'You have entered an invalid login or password',
      })
    }

    if (!await bcrypt.compare(password, user.password)) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: 'You have entered an invalid login or password',
      })
    }

    const payload = {
      userId: user.id,
      login: user.login,
    };

    return res
      .status(HttpStatus.OK)
      .json({
        accessToken: await this.jwtService.signAsync(payload),
        refreshToken: await this.jwtService.signAsync(payload),
        ...this.userService.formatUser(user)
      });
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDto, @Res() res: Response) {
    const { refreshToken } = refreshDto;
    const errors: Partial<Record<keyof RefreshDto, string>> = {};

    if (
      typeof refreshToken !== 'string'
    ) {
      errors.refreshToken = 'Field "refreshToken" is not provided or invalid';
    }

    if (Object.keys(errors).length !== 0) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        errors,
      });
    }

    try {
      const { userId, login } = await this.jwtService.verifyAsync(refreshToken);

      const user = await this.userService.findOne(userId);

      if (!user) {
        return res.status(HttpStatus.FORBIDDEN).json({
          error: 'Refresh token is invalid or expired',
        });
      }

      const payload = {
        userId,
        login,
      };

      return res.status(HttpStatus.OK).json({
        accessToken: await this.jwtService.signAsync(payload),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d'
        }),
      })
    } catch (err) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: 'Refresh token is invalid or expired',
      });
    }
  }
}
