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
import { UUIDService } from 'src/uuid/uuid.service';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/prisma/prisma.service';

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 128;

@ApiTags('Artist')
@Controller()
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly prismaService: PrismaService,
    private readonly uuidService: UUIDService,
  ) {}

  @Post()
  async create(@Body() createArtistDto: CreateArtistDto, @Res() res: Response) {
    const { name, grammy } = createArtistDto;
    const errors: Partial<Record<keyof CreateArtistDto, string>> = {};

    if (
      typeof name !== 'string' ||
      name.length < MIN_NAME_LENGTH ||
      name.length > MAX_NAME_LENGTH
    ) {
      errors.name = 'Field "name" is not provided or invalid';
    }

    if (typeof grammy !== 'boolean') {
      errors.grammy = 'Field "grammy" is not provided or invalid';
    }

    if (Object.keys(errors).length !== 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        errors,
      });
    }

    return res
      .status(HttpStatus.CREATED)
      .json(await this.artistService.create(createArtistDto));
  }

  @Get()
  async findAll() {
    return await this.artistService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
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

    return res.status(HttpStatus.OK).json(artist);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
    @Res() res: Response,
  ) {
    if (!this.uuidService.validate(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: `ID=${id} is not valid UUID`,
      });
    }

    const { name, grammy } = updateArtistDto;
    const errors: Partial<Record<keyof UpdateArtistDto, string>> = {};

    if (
      typeof name !== 'string' ||
      name.length < MIN_NAME_LENGTH ||
      name.length > MAX_NAME_LENGTH
    ) {
      errors.name = 'Field "name" is invalid';
    }

    if (typeof grammy !== 'boolean') {
      errors.grammy = 'Field "grammy" is invalid';
    }

    if (Object.keys(errors).length !== 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        errors,
      });
    }

    const artist = await this.artistService.findOne(id);

    if (!artist) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: `Artist with ID=${id} is not found`,
      });
    }

    return res
      .status(HttpStatus.OK)
      .json(await this.artistService.update(id, updateArtistDto));
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

    await this.prismaService.favoriteArtist.deleteMany({
      where: {
        artistId: id,
      },
    });

    await this.artistService.remove(id);

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
