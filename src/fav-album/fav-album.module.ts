import { Module } from '@nestjs/common';
import { FavAlbumService } from './fav-album.service';
import { FavAlbumController } from './fav-album.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FavAlbumController],
  providers: [FavAlbumService]
})
export class FavAlbumModule {}
