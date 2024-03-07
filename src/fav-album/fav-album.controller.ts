import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateFavAlbumDto } from './dto/create-fav-album.dto';
import { FavAlbumService } from './fav-album.service';

@Controller('fav-album')
export class FavAlbumController {
  constructor(private readonly favAlbumService: FavAlbumService) {}

  @Post()
  create(@Body() createFavAlbumDto: CreateFavAlbumDto) {
    return this.favAlbumService.create(createFavAlbumDto);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favAlbumService.remove(+id);
  }
}
