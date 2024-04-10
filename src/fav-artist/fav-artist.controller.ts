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
import { ArtistService } from 'src/artist/artist.service';
import { UUIDService } from 'src/uuid/uuid.service';
import { FavArtistService } from './fav-artist.service';
import { ApiTags } from '@nestjs/swagger';
import { LoggingService } from 'src/logging/logging.service';
import { LoggingInterceptor } from 'src/logging/logging.interceptor';

@ApiTags('Favorite Artists')
@UseInterceptors(new LoggingInterceptor('Fav Artist', new LoggingService()))
@Controller()
export class FavArtistController {
  constructor(
    private readonly favArtistService: FavArtistService,
    private readonly artistService: ArtistService,
    private readonly uuidService: UUIDService,
  ) {}

  @Post(':id')
  async create(@Param('id') id: string, @Res() res: Response) {
    if (!this.uuidService.validate(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: `ID=${id} is not valid UUID`,
      });
    }

    const artist = await this.artistService.findOne(id);

    if (!artist) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        error: `Artist with ID=${id} is not found`,
      });
    }

    await this.favArtistService.create(id);

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

    const artist = await this.artistService.findOne(id);

    if (!artist) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: `Artist with ID=${id} is not found`,
      });
    }

    await this.favArtistService.remove(id);

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
