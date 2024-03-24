import { Controller, Get } from '@nestjs/common';
import { FavService } from './fav.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Favorite')
@Controller()
export class FavController {
  constructor(private readonly favService: FavService) {}

  @Get()
  findAll() {
    return this.favService.findAll();
  }
}
