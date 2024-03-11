import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavService {
  constructor(private readonly dbService: DatabaseService) {}

  findAll() {
    const favoritesArtists = this.dbService.artists.filter((artist) =>
      this.dbService.favorites.artists.includes(artist.id),
    );
    const favoritesAlbums = this.dbService.albums.filter((album) =>
      this.dbService.favorites.albums.includes(album.id),
    );
    const favoritesTracks = this.dbService.tracks.filter((track) =>
      this.dbService.favorites.tracks.includes(track.id),
    );

    return {
      artists: favoritesArtists,
      albums: favoritesAlbums,
      tracks: favoritesTracks,
    };
  }
}
