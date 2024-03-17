import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { UUIDService } from 'src/uuid/uuid.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackService } from './track.service';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/prisma/prisma.service';

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 128;

@ApiTags('Track')
@Controller()
export class TrackController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly trackService: TrackService,
    private readonly uuidService: UUIDService,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
  ) {}

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto, @Res() res: Response) {
    const { name, artistId, albumId, duration } = createTrackDto;
    const errors: Partial<Record<keyof CreateTrackDto, string>> = {};

    if (
      typeof name !== 'string' ||
      name.length < MIN_NAME_LENGTH ||
      name.length > MAX_NAME_LENGTH
    ) {
      errors.name = 'Field "name" is not provided or invalid';
    }

    if (typeof artistId !== 'string' && artistId !== null) {
      errors.artistId = 'Field "artistId" is invalid';
    } else {
      if (artistId !== null) {
        const artist = await this.artistService.findOne(artistId);

        if (!artist) {
          errors.artistId = `Artist with ID=${artistId} is not found`;
        }
      }
    }

    if (typeof albumId !== 'string' && albumId !== null) {
      errors.albumId = 'Field "albumId" is invalid';
    } else {
      if (albumId !== null) {
        const album = await this.albumService.findOne(albumId);

        if (!album) {
          errors.albumId = `Album with ID=${albumId} is not found`;
        }
      }
    }

    if (typeof duration !== 'number') {
      errors.duration = 'Field "duration" is not provided';
    }

    if (Object.keys(errors).length !== 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        errors,
      });
    }

    return res
      .status(HttpStatus.CREATED)
      .json(await this.trackService.create(createTrackDto));
  }

  @Get()
  async findAll() {
    return await this.trackService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
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

    return res.status(HttpStatus.OK).json(track);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
    @Res() res: Response,
  ) {
    if (!this.uuidService.validate(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: `ID=${id} is not valid UUID`,
      });
    }

    const { name, artistId, albumId, duration } = updateTrackDto;
    const errors: Partial<Record<keyof UpdateTrackDto, string>> = {};

    if (
      typeof name !== 'string' ||
      name.length < MIN_NAME_LENGTH ||
      name.length > MAX_NAME_LENGTH
    ) {
      errors.name = 'Field "name" is not provided or invalid';
    }

    if (typeof artistId !== 'string' && artistId !== null) {
      errors.artistId = 'Field "artistId" is invalid';
    } else {
      if (artistId !== null) {
        const artist = await this.artistService.findOne(artistId);

        if (!artist) {
          errors.artistId = `Artist with ID=${artistId} is not found`;
        }
      }
    }

    if (typeof albumId !== 'string' && albumId !== null) {
      errors.albumId = 'Field "albumId" is invalid';
    } else {
      if (albumId !== null) {
        const album = await this.albumService.findOne(albumId);

        if (!album) {
          errors.albumId = `Album with ID=${albumId} is not found`;
        }
      }
    }

    if (typeof duration !== 'number') {
      errors.duration = 'Field "duration" is not provided';
    }

    if (Object.keys(errors).length !== 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        errors,
      });
    }

    const track = await this.trackService.findOne(id);

    if (!track) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: `Track with ID=${id} is not found`,
      });
    }

    return res.status(HttpStatus.OK).json(await this.trackService.update(id, updateTrackDto));
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

    await this.prismaService.favoriteTrack.deleteMany({
      where: {
        trackId: id
      }
    });

    await this.trackService.remove(id);

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
