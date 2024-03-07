import { Test, TestingModule } from '@nestjs/testing';
import { FavTrackController } from './fav-track.controller';
import { FavTrackService } from './fav-track.service';

describe('FavTrackController', () => {
  let controller: FavTrackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavTrackController],
      providers: [FavTrackService],
    }).compile();

    controller = module.get<FavTrackController>(FavTrackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
