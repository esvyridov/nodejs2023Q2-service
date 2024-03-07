import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateFavArtistDto } from './dto/create-fav-artist.dto';
import { FavArtistService } from './fav-artist.service';

@Controller('fav-artist')
export class FavArtistController {
  constructor(private readonly favArtistService: FavArtistService) {}

  @Post()
  create(@Body() createFavArtistDto: CreateFavArtistDto) {
    return this.favArtistService.create(createFavArtistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favArtistService.remove(+id);
  }
}
