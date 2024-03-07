import { Module } from '@nestjs/common';
import { FavTrackService } from './fav-track.service';
import { FavTrackController } from './fav-track.controller';
import { UUIDModule } from 'src/uuid/uuid.module';
import { DatabaseModule } from 'src/database/database.module';
import { TrackModule } from 'src/track/track.module';

@Module({
  imports: [DatabaseModule, UUIDModule, TrackModule],
  controllers: [FavTrackController],
  providers: [FavTrackService]
})
export class FavTrackModule {}
