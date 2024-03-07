import { Injectable } from '@nestjs/common';
import { CreateFavAlbumDto } from './dto/create-fav-album.dto';
import { UpdateFavAlbumDto } from './dto/update-fav-album.dto';

@Injectable()
export class FavAlbumService {
  create(createFavAlbumDto: CreateFavAlbumDto) {
    return 'This action adds a new favAlbum';
  }

  findAll() {
    return `This action returns all favAlbum`;
  }

  findOne(id: number) {
    return `This action returns a #${id} favAlbum`;
  }

  update(id: number, updateFavAlbumDto: UpdateFavAlbumDto) {
    return `This action updates a #${id} favAlbum`;
  }

  remove(id: number) {
    return `This action removes a #${id} favAlbum`;
  }
}
