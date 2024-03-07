import { Injectable } from '@nestjs/common';
import { Album } from 'src/album/entities/album.entity';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavAlbumService {
  constructor(private readonly dbService: DatabaseService) {}

  create(album: Album) {
    this.dbService.favorites.albums.push(album);
  }

  remove(id: string) {
    this.dbService.favorites.albums = this.dbService.favorites.albums.filter((album) => album.id !== id);
  }
}
