import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RouterModule } from '@nestjs/core';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';

@Module({
  imports: [
    UserModule,
    RouterModule.register([
      {
        path: 'user',
        module: UserModule,
      },
      {
        path: 'track',
        module: TrackModule,
      },
      {
        path: 'artist',
        module: ArtistModule,
      },
      {
        path: 'album',
        module: AlbumModule,
      }
    ]),
    TrackModule,
    ArtistModule,
    AlbumModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
