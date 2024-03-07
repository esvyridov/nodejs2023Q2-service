import { Module } from '@nestjs/common';
import { FavTrackService } from './fav-track.service';
import { FavTrackController } from './fav-track.controller';

@Module({
  controllers: [FavTrackController],
  providers: [FavTrackService]
})
export class FavTrackModule {}
