import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UUIDModule } from 'src/uuid/uuid.module';
import { ArtistModule } from 'src/artist/artist.module';

@Module({
  imports: [DatabaseModule, UUIDModule, ArtistModule],
  controllers: [AlbumController],
  providers: [AlbumService]
})
export class AlbumModule {}
