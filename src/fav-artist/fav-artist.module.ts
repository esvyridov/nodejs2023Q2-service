import { Module } from '@nestjs/common';
import { FavArtistService } from './fav-artist.service';
import { FavArtistController } from './fav-artist.controller';
import { UUIDModule } from 'src/uuid/uuid.module';
import { ArtistModule } from 'src/artist/artist.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [UUIDModule, PrismaModule, ArtistModule],
  controllers: [FavArtistController],
  providers: [FavArtistService],
})
export class FavArtistModule {}
