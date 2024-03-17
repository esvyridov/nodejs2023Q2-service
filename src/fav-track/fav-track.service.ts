import { Injectable } from '@nestjs/common';
import { FavoriteTrack } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavTrackService {
  constructor(private readonly prismaService: PrismaService) {}

  create(trackId: string): Promise<FavoriteTrack> {
    return this.prismaService.favoriteTrack.create({
      data: {
        trackId,
      }
    });
  }

  async remove(trackId: string) {
    await this.prismaService.favoriteTrack.deleteMany({
      where: {
        trackId,
      }
    });
  }
}
