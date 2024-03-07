import { Test, TestingModule } from '@nestjs/testing';
import { FavArtistService } from './fav-artist.service';

describe('FavArtistService', () => {
  let service: FavArtistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavArtistService],
    }).compile();

    service = module.get<FavArtistService>(FavArtistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
