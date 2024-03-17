import { Injectable } from '@nestjs/common';
import { FavoriteAlbum } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavAlbumService {
  constructor(private readonly prismaService: PrismaService) {}

  create(albumId: string): Promise<FavoriteAlbum> {
    return this.prismaService.favoriteAlbum.create({
      data: {
        albumId: albumId,
      }
    });
  }

  async remove(albumId: string): Promise<void> {
    await this.prismaService.favoriteAlbum.deleteMany({
      where: {
        albumId,
      }
    });
  }
}
