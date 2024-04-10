import { Module } from '@nestjs/common';
import { FavAlbumService } from './fav-album.service';
import { FavAlbumController } from './fav-album.controller';
import { UUIDModule } from 'src/uuid/uuid.module';
import { AlbumModule } from 'src/album/album.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [UUIDModule, PrismaModule, AlbumModule],
  controllers: [FavAlbumController],
  providers: [FavAlbumService],
})
export class FavAlbumModule {}
