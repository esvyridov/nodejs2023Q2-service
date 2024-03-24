import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Album } from '@prisma/client';

@Injectable()
export class AlbumService {
  constructor(private readonly prismaService: PrismaService) {}

  create({ name, year, artistId }: CreateAlbumDto): Promise<Album> {
    return this.prismaService.album.create({
      data: {
        name,
        year,
        artistId,
      },
    });
  }

  findAll(): Promise<Album[]> {
    return this.prismaService.album.findMany();
  }

  findOne(id: string): Promise<Album> {
    return this.prismaService.album.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, { name, year, artistId }: UpdateAlbumDto): Promise<Album> {
    return this.prismaService.album.update({
      where: {
        id,
      },
      data: {
        name,
        year,
        artistId,
      },
    });
  }

  remove(id: string): Promise<Album> {
    return this.prismaService.album.delete({
      where: {
        id,
      },
    });
  }
}
