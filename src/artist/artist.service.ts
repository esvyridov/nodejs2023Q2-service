import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { DatabaseService } from 'src/database/database.service';
import { UUIDService } from 'src/uuid/uuid.service';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  constructor(private readonly dbService: DatabaseService, private readonly uuidService: UUIDService) {}

  create({ name, grammy }: CreateArtistDto): Artist {
    const artist: Artist = {
      id: this.uuidService.generate(),
      name,
      grammy
    };

    this.dbService.artists.push(artist);

    return artist;
  }

  findAll(): Artist[] {
    return this.dbService.artists;
  }

  findOne(id: string): Artist | undefined {
    return this.dbService.artists.find((artist) => artist.id === id);
  }

  update(id: string, { name, grammy }: UpdateArtistDto): void {
    this.dbService.artists = this.dbService.artists.map((artist) => {
      if (artist.id === id) {
        return {
          ...artist,
          name,
          grammy,
        }
      }
      
      return artist;
    });
  }

  remove(id: string): void {
    this.dbService.artists = this.dbService.artists.filter((artist) => artist.id !== id);
  }
}
