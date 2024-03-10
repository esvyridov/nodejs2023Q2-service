import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RouterModule } from '@nestjs/core';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { FavModule } from './fav/fav.module';
import { FavTrackModule } from './fav-track/fav-track.module';
import { FavAlbumModule } from './fav-album/fav-album.module';
import { FavArtistModule } from './fav-artist/fav-artist.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
      },
      {
        path: 'favs',
        module: FavModule,
        children: [
          {
            path: 'track',
            module: FavTrackModule,
          },
          {
            path: 'album',
            module: FavAlbumModule,
          },
          {
            path: 'artist',
            module: FavArtistModule,
          },
        ],
      },
    ]),
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavModule,
    FavTrackModule,
    FavAlbumModule,
    FavArtistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
