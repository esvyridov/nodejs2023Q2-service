import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UUIDModule } from 'src/uuid/uuid.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, UUIDModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
