import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { PrismaModule } from './prisma/prisma.module';
import { LoggingModule } from './logging/logging.module';
import { UnhandledRejectionHandler } from './utils/unhandled-rejection.exception';
import { UncaughtExceptionHandler } from './utils/uncaught-exception.exception';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { AlbumController } from './album/album.controller';
import { ArtistController } from './artist/artist.controller';
import { FavController } from './fav/fav.controller';
import { FavAlbumController } from './fav-album/fav-album.controller';
import { FavArtistController } from './fav-artist/fav-artist.controller';
import { FavTrackController } from './fav-track/fav-track.controller';
import { TrackController } from './track/track.controller';
import { AuthController } from './auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '24h' },
    }),
    RouterModule.register([
      {
        path: 'auth',
        module: AuthModule,
      },
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
    LoggingModule,
    AuthModule,
  ],
  providers: [
    UnhandledRejectionHandler,
    UncaughtExceptionHandler,
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        AlbumController,
        ArtistController,
        FavController,
        FavAlbumController,
        FavArtistController,
        FavTrackController,
        TrackController,
        UserController,
      );

    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/auth/login', method: RequestMethod.POST },
        { path: '/auth/signup', method: RequestMethod.POST }
      )
      .forRoutes(AuthController)
  }
}
