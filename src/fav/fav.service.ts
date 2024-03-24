import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const artists = await this.prismaService.favoriteArtist.findMany({
      include: {
        artist: true,
      },
    });
    const albums = await this.prismaService.favoriteAlbum.findMany({
      include: {
        album: true,
      },
    });
    const tracks = await this.prismaService.favoriteTrack.findMany({
      include: {
        track: true,
      },
    });

    return {
      artists: artists.map(({ artist }) => artist),
      albums: albums.map(({ album }) => album),
      tracks: tracks.map(({ track }) => track),
    };
  }
}
