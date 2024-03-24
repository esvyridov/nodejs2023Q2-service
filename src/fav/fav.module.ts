import { Module } from '@nestjs/common';
import { FavService } from './fav.service';
import { FavController } from './fav.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FavController],
  providers: [FavService],
})
export class FavModule {}
