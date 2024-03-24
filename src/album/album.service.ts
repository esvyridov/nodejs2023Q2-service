import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DatabaseService } from 'src/database/database.service';
import { UUIDService } from 'src/uuid/uuid.service';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly uuidService: UUIDService,
  ) {}

  create({ name, year, artistId }: CreateAlbumDto): Album {
    const album = {
      id: this.uuidService.generate(),
      name,
      year,
      artistId,
    };

    this.dbService.albums.push(album);

    return album;
  }

  findAll(): Album[] {
    return this.dbService.albums;
  }

  findOne(id: string): Album | undefined {
    return this.dbService.albums.find((album) => album.id === id);
  }

  update(id: string, { name, year, artistId }: UpdateAlbumDto): void {
    this.dbService.albums = this.dbService.albums.map((album) => {
      if (album.id === id) {
        return {
          ...album,
          name,
          year,
          artistId,
        };
      }

      return album;
    });
  }

  remove(id: string): void {
    this.dbService.albums = this.dbService.albums.filter(
      (album) => album.id !== id,
    );
  }
}
