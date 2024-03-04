import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { DatabaseService } from 'src/database/database.service';
import { UUIDService } from 'src/uuid/uuid.service';
import { Track } from './entities/track.entity';

@Injectable()
export class TrackService {
  constructor(private readonly dbService: DatabaseService, private readonly uuidService: UUIDService) {}

  create({ name, artistId, albumId, duration }: CreateTrackDto) {
    const timestamp = new Date().valueOf();
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

  findAll() {
    return this.dbService.tracks;
  }

  findOne(id: string) {
    return this.dbService.tracks.find((track) => track.id === id);
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    return `This action updates a #${id} track`;
  }

  remove(id: string) {
    this.dbService.tracks = this.dbService.tracks.filter((track) => track.id === id);
  }
}
