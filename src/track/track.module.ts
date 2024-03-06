import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UUIDModule } from 'src/uuid/uuid.module';
import { ArtistModule } from 'src/artist/artist.module';
import { AlbumModule } from 'src/album/album.module';

@Module({
  imports: [DatabaseModule, UUIDModule, ArtistModule, AlbumModule],
  controllers: [TrackController],
  providers: [TrackService]
})
export class TrackModule {}
