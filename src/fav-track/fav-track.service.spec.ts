import { Test, TestingModule } from '@nestjs/testing';
import { FavTrackService } from './fav-track.service';

describe('FavTrackService', () => {
  let service: FavTrackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavTrackService],
    }).compile();

    service = module.get<FavTrackService>(FavTrackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
