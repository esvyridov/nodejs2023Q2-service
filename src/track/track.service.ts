import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Track } from '@prisma/client';

@Injectable()
export class TrackService {
  constructor(private readonly prismaService: PrismaService) {}

  create({
    name,
    artistId,
    albumId,
    duration,
  }: CreateTrackDto): Promise<Track> {
    return this.prismaService.track.create({
      data: {
        name,
        artistId,
        albumId,
        duration,
      },
    });
  }

  findAll(): Promise<Track[]> {
    return this.prismaService.track.findMany();
  }

  findOne(id: string): Promise<Track | undefined> {
    return this.prismaService.track.findUnique({
      where: {
        id,
      },
    });
  }

  update(
    id: string,
    { name, artistId, albumId, duration }: UpdateTrackDto,
  ): Promise<Track | undefined> {
    return this.prismaService.track.update({
      where: {
        id,
      },
      data: {
        name,
        artistId,
        albumId,
        duration,
      },
    });
  }

  remove(id: string): Promise<Track> {
    return this.prismaService.track.delete({
      where: {
        id,
      },
    });
  }
}
