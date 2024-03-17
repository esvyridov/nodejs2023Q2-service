import { Injectable } from '@nestjs/common';
import { FavoriteArtist } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavArtistService {
  constructor(private readonly prismaService: PrismaService) {}

  create(artistId: string): Promise<FavoriteArtist> {
    return this.prismaService.favoriteArtist.create({
      data: {
        artistId,
      }
    });
  }

  async remove(artistId: string) {
    await this.prismaService.favoriteArtist.deleteMany({
      where: {
        artistId,
      }
    });
  }
}
