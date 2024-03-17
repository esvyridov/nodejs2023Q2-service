import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Artist } from '@prisma/client';

@Injectable()
export class ArtistService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  create({ name, grammy }: CreateArtistDto): Promise<Artist> {
    return this.prismaService.artist.create({
      data: {
        name,
        grammy,
      }
    });
  }

  findAll(): Promise<Artist[]> {
    return this.prismaService.artist.findMany();
  }

  findOne(id: string): Promise<Artist | undefined> {
    return this.prismaService.artist.findUnique({
      where: {
        id,
      }
    });
  }

  update(id: string, { name, grammy }: UpdateArtistDto): Promise<Artist> {
    return this.prismaService.artist.update({
      where: {
        id,
      },
      data: {
        name,
        grammy,
      }
    });
  }

  remove(id: string): Promise<Artist> {
    return this.prismaService.artist.delete({
      where: {
        id,
      }
    });
  }
}
