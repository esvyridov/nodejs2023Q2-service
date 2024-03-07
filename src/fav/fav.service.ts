import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavService {
  constructor(private readonly dbService: DatabaseService) {}

  findAll() {
    return this.dbService.favorites;
  }
}
