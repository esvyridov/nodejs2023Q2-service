import { Injectable } from '@nestjs/common';
import { Track } from 'src/track/entities/track.entity';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavTrackService {
  constructor(private readonly dbService: DatabaseService) {}

  create(track: Track) {
    this.dbService.favorites.tracks.push(track);
  }

  remove(id: string) {
    this.dbService.favorites.tracks = this.dbService.favorites.tracks.filter((track) => track.id !== id);
  }
}
