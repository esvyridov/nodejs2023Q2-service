import { Controller, Get } from '@nestjs/common';
import { FavService } from './fav.service';

@Controller()
export class FavController {
  constructor(private readonly favService: FavService) {}

  @Get()
  findAll() {
    return this.favService.findAll();
  }
}
