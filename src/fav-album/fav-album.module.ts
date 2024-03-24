import { Module } from '@nestjs/common';
import { FavAlbumService } from './fav-album.service';
import { FavAlbumController } from './fav-album.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UUIDModule } from 'src/uuid/uuid.module';
import { AlbumModule } from 'src/album/album.module';

@Module({
  imports: [DatabaseModule, UUIDModule, AlbumModule],
  controllers: [FavAlbumController],
  providers: [FavAlbumService],
})
export class FavAlbumModule {}
