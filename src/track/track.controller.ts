import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, Put } from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { UUIDService } from 'src/uuid/uuid.service';
import { Response } from 'express';

const MIN_NAME_LENGTH = 1;

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService, private readonly uuidService: UUIDService) {}

  @Post()
  create(@Body() createTrackDto: CreateTrackDto, @Res() res: Response) {
    const { name, artistId, albumId, duration } = createTrackDto;
    const errors: Partial<Record<keyof CreateTrackDto, string>> = {};

    if (name?.length < MIN_NAME_LENGTH) {
      errors.name = 'Field "name" is not provided or invalid';
    }

    if (artistId !== null || typeof artistId !== 'number') {
      errors.artistId = 'Field "artistId" is invalid'
    }

    if (albumId !== null || typeof albumId !== 'number') {
      errors.albumId = 'Field "albumId" is invalid'
    }
    
    if (duration === undefined) {
      errors.duration = 'Field "duration" is not provided';
    }

    if (Object.keys(errors).length !== 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        errors
      });
    }

    return res.status(HttpStatus.CREATED).json(this.trackService.create(createTrackDto));
  }

  @Get()
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    if (!this.uuidService.validate(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: `ID=${id} is not valid UUID`,
      });
    }

    const track = this.trackService.findOne(id);

    if (!track) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: `Track with ID=${id} is not found`,
      });
    }

    return this.trackService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto, @Res() res: Response) {
    if (!this.uuidService.validate(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: `ID=${id} is not valid UUID`,
      });
    }

    const track = this.trackService.findOne(id);

    if (!track) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: `Track with ID=${id} is not found`,
      });
    }

    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response) {
    if (!this.uuidService.validate(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: `ID=${id} is not valid UUID`,
      });
    }

    const track = this.trackService.findOne(id);

    if (!track) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: `Track with ID=${id} is not found`,
      });
    }

    this.trackService.remove(id);

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
