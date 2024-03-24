import { Module } from '@nestjs/common';
import { FavTrackService } from './fav-track.service';
import { FavTrackController } from './fav-track.controller';
import { UUIDModule } from 'src/uuid/uuid.module';
import { TrackModule } from 'src/track/track.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [UUIDModule, PrismaModule, TrackModule],
  controllers: [FavTrackController],
  providers: [FavTrackService],
})
export class FavTrackModule {}
