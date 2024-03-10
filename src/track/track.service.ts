import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { DatabaseService } from 'src/database/database.service';
import { UUIDService } from 'src/uuid/uuid.service';
import { Track } from './entities/track.entity';

@Injectable()
export class TrackService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly uuidService: UUIDService,
  ) {}

  create({ name, artistId, albumId, duration }: CreateTrackDto): Track {
    const track: Track = {
      id: this.uuidService.generate(),
      name,
      artistId,
      albumId,
      duration,
    };

    this.dbService.tracks.push(track);

    return track;
  }

  findAll(): Track[] {
    return this.dbService.tracks;
  }

  findOne(id: string): Track | undefined {
    return this.dbService.tracks.find((track) => track.id === id);
  }

  update(
    id: string,
    { name, artistId, albumId, duration }: UpdateTrackDto,
  ): void {
    this.dbService.tracks = this.dbService.tracks.map((track) => {
      if (track.id === id) {
        return {
          ...track,
          name,
          artistId,
          albumId,
          duration,
        };
      }

      return track;
    });
  }

  remove(id: string): void {
    this.dbService.tracks = this.dbService.tracks.filter(
      (track) => track.id !== id,
    );
  }
}
