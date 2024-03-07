import { Module } from '@nestjs/common';
import { FavArtistService } from './fav-artist.service';
import { FavArtistController } from './fav-artist.controller';

@Module({
  controllers: [FavArtistController],
  providers: [FavArtistService]
})
export class FavArtistModule {}
