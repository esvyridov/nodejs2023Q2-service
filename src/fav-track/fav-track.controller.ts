import {
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { FavTrackService } from './fav-track.service';
import { UUIDService } from 'src/uuid/uuid.service';
import { Response } from 'express';
import { TrackService } from 'src/track/track.service';
import { ApiTags } from '@nestjs/swagger';
import { LoggingService } from 'src/logging/logging.service';
import { LoggingInterceptor } from 'src/logging/logging.interceptor';

@ApiTags('Favorite Tracks')
@UseInterceptors(new LoggingInterceptor('Fav Track', new LoggingService()))
@Controller()
export class FavTrackController {
  constructor(
    private readonly favTrackService: FavTrackService,
    private readonly trackService: TrackService,
    private readonly uuidService: UUIDService,
  ) {}

  @Post(':id')
  async create(@Param('id') id: string, @Res() res: Response) {
    if (!this.uuidService.validate(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: `ID=${id} is not valid UUID`,
      });
    }

    const track = await this.trackService.findOne(id);

    if (!track) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        error: `Track with ID=${id} is not found`,
      });
    }

    await this.favTrackService.create(id);

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

    const track = await this.trackService.findOne(id);

    if (!track) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: `Track with ID=${id} is not found`,
      });
    }

    await this.favTrackService.remove(id);

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
