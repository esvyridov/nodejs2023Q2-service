import {
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AlbumService } from 'src/album/album.service';
import { UUIDService } from 'src/uuid/uuid.service';
import { FavAlbumService } from './fav-album.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Favorite Albums')
@Controller()
export class FavAlbumController {
  constructor(
    private readonly favAlbumService: FavAlbumService,
    private readonly albumService: AlbumService,
    private readonly uuidService: UUIDService,
  ) {}

  @Post(':id')
  create(@Param('id') id: string, @Res() res: Response) {
    if (!this.uuidService.validate(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: `ID=${id} is not valid UUID`,
      });
    }

    const album = this.albumService.findOne(id);

    if (!album) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        error: `Album with ID=${id} is not found`,
      });
    }

    this.favAlbumService.create(album);

    return res.status(HttpStatus.CREATED).json({
      ok: true,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response) {
    if (!this.uuidService.validate(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: `ID=${id} is not valid UUID`,
      });
    }

    const album = this.albumService.findOne(id);

    if (!album) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: `Album with ID=${id} is not found`,
      });
    }

    this.favAlbumService.remove(id);

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
