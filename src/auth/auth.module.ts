import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { AuthMiddleware } from './auth.middleware';
import { JwtAuthModule } from 'src/jwt-auth/jwt-auth.module';

@Module({
  imports: [UserModule, JwtAuthModule],
  controllers: [AuthController],
  providers: [AuthService, AuthMiddleware]
})
export class AuthModule {}
