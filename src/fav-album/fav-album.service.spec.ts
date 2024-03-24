import { Test, TestingModule } from '@nestjs/testing';
import { FavAlbumService } from './fav-album.service';

describe('FavAlbumService', () => {
  let service: FavAlbumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavAlbumService],
    }).compile();

    service = module.get<FavAlbumService>(FavAlbumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
