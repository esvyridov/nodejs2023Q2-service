import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  Res,
  Put,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { UUIDService } from 'src/uuid/uuid.service';
import { Response } from 'express';
import { ArtistService } from 'src/artist/artist.service';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/prisma/prisma.service';

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 128;

@ApiTags('Album')
@Controller()
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly prismaService: PrismaService,
    private readonly uuidService: UUIDService,
    private readonly artistService: ArtistService,
  ) {}

  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto, @Res() res: Response) {
    const { name, year, artistId } = createAlbumDto;
    const errors: Partial<Record<keyof CreateAlbumDto, string>> = {};

    if (
      typeof name !== 'string' ||
      name.length < MIN_NAME_LENGTH ||
      name.length > MAX_NAME_LENGTH
    ) {
      errors.name = 'Field "name" is not provided or invalid';
    }

    if (typeof year !== 'number') {
      errors.year = 'Field "year" is not provided or invalid';
    }

    if (typeof artistId !== 'string' && artistId !== null) {
      errors.artistId = 'Field "artistId" is not provided or invalid';
    } else {
      if (artistId !== null) {
        const artist = this.artistService.findOne(artistId);

        if (!artist) {
          errors.artistId = `Artist with ID=${artistId} is not found`;
        }
      }
    }

    if (Object.keys(errors).length !== 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        errors,
      });
    }

    return res
      .status(HttpStatus.CREATED)
      .json(await this.albumService.create(createAlbumDto));
  }

  @Get()
  async findAll() {
    return await this.albumService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
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

    return res.status(HttpStatus.OK).json(album);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
    @Res() res: Response,
  ) {
    if (!this.uuidService.validate(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: `ID=${id} is not valid UUID`,
      });
    }

    const { name, year, artistId } = updateAlbumDto;
    const errors: Partial<Record<keyof UpdateAlbumDto, string>> = {};

    if (
      typeof name !== 'string' ||
      name.length < MIN_NAME_LENGTH ||
      name.length > MAX_NAME_LENGTH
    ) {
      errors.name = 'Field "name" is not provided or invalid';
    }

    if (typeof year !== 'number') {
      errors.year = 'Field "year" is not provided or invalid';
    }

    if (typeof artistId !== 'string' && artistId !== null) {
      errors.artistId = 'Field "artistId" is not provided or invalid';
    } else {
      if (artistId !== null) {
        const artist = await this.artistService.findOne(artistId);

        if (!artist) {
          errors.artistId = `Artist with ID=${artistId} is not found`;
        }
      }
    }

    if (Object.keys(errors).length !== 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        errors,
      });
    }

    const album = await this.albumService.findOne(id);

    if (!album) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: `Album with ID=${id} is not found`,
      });
    }

    return res
      .status(HttpStatus.OK)
      .json(await this.albumService.update(id, updateAlbumDto));
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

    await this.prismaService.favoriteAlbum.deleteMany({
      where: {
        albumId: id,
      },
    });

    await this.albumService.remove(id);

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
