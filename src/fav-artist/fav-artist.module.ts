import { Module } from '@nestjs/common';
import { FavArtistService } from './fav-artist.service';
import { FavArtistController } from './fav-artist.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UUIDModule } from 'src/uuid/uuid.module';
import { ArtistModule } from 'src/artist/artist.module';

@Module({
  imports: [DatabaseModule, UUIDModule, ArtistModule],
  controllers: [FavArtistController],
  providers: [FavArtistService]
})
export class FavArtistModule {}
