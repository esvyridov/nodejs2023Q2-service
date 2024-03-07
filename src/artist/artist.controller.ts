import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, Put } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { UUIDService } from 'src/uuid/uuid.service';
import { Response } from 'express';
import { DatabaseService } from 'src/database/database.service';

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 128;

@Controller()
export class ArtistController {
  constructor(private readonly artistService: ArtistService, private readonly uuidService: UUIDService, private readonly dbService: DatabaseService) {}

  @Post()
  create(@Body() createArtistDto: CreateArtistDto, @Res() res: Response) {
    const { name, grammy } = createArtistDto;
    const errors: Partial<Record<keyof CreateArtistDto, string>> = {};

    if (typeof name !== 'string' || name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
      errors.name = 'Field "name" is not provided or invalid';
    }

    if (typeof grammy !== 'boolean') {
      errors.grammy = 'Field "grammy" is not provided or invalid';
    }

    if (Object.keys(errors).length !== 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        errors
      });
    }

    return res.status(HttpStatus.CREATED).json(this.artistService.create(createArtistDto));
  }

  @Get()
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
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

    return res.status(HttpStatus.OK).json(artist);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto, @Res() res: Response) {
    if (!this.uuidService.validate(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: `ID=${id} is not valid UUID`,
      });
    }
    
    const { name, grammy } = updateArtistDto;
    const errors: Partial<Record<keyof UpdateArtistDto, string>> = {};

    if (typeof name !== 'string' || name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
      errors.name = 'Field "name" is invalid';
    }

    if (typeof grammy !== 'boolean') {
      errors.grammy = 'Field "grammy" is invalid';
    }

    if (Object.keys(errors).length !== 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        errors
      });
    }

    const artist = this.artistService.findOne(id);

    if (!artist) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: `Artist with ID=${id} is not found`,
      });
    }

    this.artistService.update(id, updateArtistDto)

    return res.status(HttpStatus.OK).json(this.artistService.findOne(id));
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

    this.dbService.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });

    this.dbService.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    })

    this.dbService.favorites.artists = this.dbService.favorites.artists.filter((artist) => artist.id !== id);

    this.artistService.remove(id);

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
