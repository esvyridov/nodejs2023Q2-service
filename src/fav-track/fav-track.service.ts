import { Injectable } from '@nestjs/common';
import { Track } from 'src/track/entities/track.entity';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavTrackService {
  constructor(private readonly dbService: DatabaseService) {}

  create(track: Track) {
    this.dbService.favorites.tracks.push(track.id);
  }

  remove(idToRemove: string) {
    this.dbService.favorites.tracks = this.dbService.favorites.tracks.filter(
      (trackId) => trackId !== idToRemove,
    );
  }
}
