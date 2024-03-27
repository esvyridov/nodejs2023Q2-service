import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { FavService } from './fav.service';
import { ApiTags } from '@nestjs/swagger';
import { LoggingService } from 'src/logging/logging.service';
import { LoggingInterceptor } from 'src/logging/logging.interceptor';

@ApiTags('Favorite')
@UseInterceptors(new LoggingInterceptor('Favorite', new LoggingService()))
@Controller()
export class FavController {
  constructor(private readonly favService: FavService) {}

  @Get()
  async findAll() {
    return await this.favService.findAll();
  }
}
