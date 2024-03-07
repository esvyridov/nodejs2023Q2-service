import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateFavTrackDto } from './dto/create-fav-track.dto';
import { FavTrackService } from './fav-track.service';

@Controller('fav-track')
export class FavTrackController {
  constructor(private readonly favTrackService: FavTrackService) {}

  @Post()
  create(@Body() createFavTrackDto: CreateFavTrackDto) {
    return this.favTrackService.create(createFavTrackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favTrackService.remove(+id);
  }
}
