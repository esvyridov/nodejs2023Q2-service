import { Injectable } from '@nestjs/common';
import { CreateFavTrackDto } from './dto/create-fav-track.dto';
import { UpdateFavTrackDto } from './dto/update-fav-track.dto';

@Injectable()
export class FavTrackService {
  create(createFavTrackDto: CreateFavTrackDto) {
    return 'This action adds a new favTrack';
  }

  findAll() {
    return `This action returns all favTrack`;
  }

  findOne(id: number) {
    return `This action returns a #${id} favTrack`;
  }

  update(id: number, updateFavTrackDto: UpdateFavTrackDto) {
    return `This action updates a #${id} favTrack`;
  }

  remove(id: number) {
    return `This action removes a #${id} favTrack`;
  }
}
