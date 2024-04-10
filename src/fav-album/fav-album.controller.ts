import {
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AlbumService } from 'src/album/album.service';
import { UUIDService } from 'src/uuid/uuid.service';
import { FavAlbumService } from './fav-album.service';
import { ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from 'src/logging/logging.interceptor';
import { LoggingService } from 'src/logging/logging.service';

@ApiTags('Favorite Albums')
@UseInterceptors(new LoggingInterceptor('Fav Album', new LoggingService()))
@Controller()
export class FavAlbumController {
  constructor(
    private readonly favAlbumService: FavAlbumService,
    private readonly albumService: AlbumService,
    private readonly uuidService: UUIDService,
  ) {}

  @Post(':id')
  async create(@Param('id') id: string, @Res() res: Response) {
    if (!this.uuidService.validate(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: `ID=${id} is not valid UUID`,
      });
    }

    const album = await this.albumService.findOne(id);

    if (!album) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        error: `Album with ID=${id} is not found`,
      });
    }

    await this.favAlbumService.create(id);

    return res.status(HttpStatus.CREATED).json({
      ok: true,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    if (!this.uuidService.validate(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: `ID=${id} is not valid UUID`,
      });
    }

    const album = await this.albumService.findOne(id);

    if (!album) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: `Album with ID=${id} is not found`,
      });
    }

    await this.favAlbumService.remove(id);

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
