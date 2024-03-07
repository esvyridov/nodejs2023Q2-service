import { Body, Controller, Delete, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { FavArtistService } from './fav-artist.service';
import { ArtistService } from 'src/artist/artist.service';
import { UUIDService } from 'src/uuid/uuid.service';
import { Response } from 'express';

@Controller()
export class FavArtistController {
  constructor(private readonly favArtistService: FavArtistService, private readonly artistService: ArtistService, private readonly uuidService: UUIDService) {}

  @Post(':id')
  create(@Param('id') id: string, @Res() res: Response) {
    if (!this.uuidService.validate(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: `ID=${id} is not valid UUID`,
      });
    }

    const artist = this.artistService.findOne(id);

    if (!artist) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        error: `Artist with ID=${id} is not found`,
      });
    }

    this.favArtistService.create(artist);

    return res.status(HttpStatus.CREATED).json({
      ok: true,
    })
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response) {
    if (!this.uuidService.validate(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: `ID=${id} is not valid UUID`,
      });
    }

    const artist = this.artistService.findOne(id);

    if (!artist) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: `Artist with ID=${id} is not found`,
      });
    }

    this.favArtistService.remove(id);

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
