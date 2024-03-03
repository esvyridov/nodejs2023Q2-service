import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UUIDModule } from 'src/uuid/uuid.module';

@Module({
  imports: [DatabaseModule, UUIDModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
