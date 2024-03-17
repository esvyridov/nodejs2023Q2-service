import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { UUIDModule } from 'src/uuid/uuid.module';
import { ArtistModule } from 'src/artist/artist.module';
import { AlbumModule } from 'src/album/album.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [TrackModule, PrismaModule, UUIDModule, ArtistModule, AlbumModule],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
