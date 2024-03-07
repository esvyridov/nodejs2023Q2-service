import { Injectable } from '@nestjs/common';
import { CreateFavArtistDto } from './dto/create-fav-artist.dto';
import { UpdateFavArtistDto } from './dto/update-fav-artist.dto';

@Injectable()
export class FavArtistService {
  create(createFavArtistDto: CreateFavArtistDto) {
    return 'This action adds a new favArtist';
  }

  findAll() {
    return `This action returns all favArtist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} favArtist`;
  }

  update(id: number, updateFavArtistDto: UpdateFavArtistDto) {
    return `This action updates a #${id} favArtist`;
  }

  remove(id: number) {
    return `This action removes a #${id} favArtist`;
  }
}
