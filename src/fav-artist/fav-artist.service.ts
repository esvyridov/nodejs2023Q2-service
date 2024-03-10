import { Injectable } from '@nestjs/common';
import { Artist } from 'src/artist/entities/artist.entity';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavArtistService {
  constructor(private readonly dbService: DatabaseService) {}

  create(artist: Artist) {
    this.dbService.favorites.artists.push(artist);
  }

  remove(id: string) {
    this.dbService.favorites.artists = this.dbService.favorites.artists.filter(
      (artist) => artist.id !== id,
    );
  }
}
