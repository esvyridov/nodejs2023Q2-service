import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UUIDModule } from 'src/uuid/uuid.module';

@Module({
  imports: [DatabaseModule, UUIDModule],
  controllers: [TrackController],
  providers: [TrackService]
})
export class TrackModule {}
