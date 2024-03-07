import { Test, TestingModule } from '@nestjs/testing';
import { FavController } from './fav.controller';
import { FavService } from './fav.service';

describe('FavController', () => {
  let controller: FavController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavController],
      providers: [FavService],
    }).compile();

    controller = module.get<FavController>(FavController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
