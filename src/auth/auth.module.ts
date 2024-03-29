import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { AuthMiddleware } from './auth.middleware';
import { JwtAuthModule } from 'src/jwt-auth/jwt-auth.module';
import { AlbumController } from 'src/album/album.controller';
import { ArtistController } from 'src/artist/artist.controller';
import { FavController } from 'src/fav/fav.controller';
import { FavAlbumController } from 'src/fav-album/fav-album.controller';
import { FavArtistController } from 'src/fav-artist/fav-artist.controller';
import { FavTrackController } from 'src/fav-track/fav-track.controller';
import { TrackController } from 'src/track/track.controller';
import { UserController } from 'src/user/user.controller';

@Module({
  imports: [UserModule, JwtAuthModule],
  controllers: [AuthController],
  providers: [AuthService, AuthMiddleware],
})
export class AuthModule implements NestModule {
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
        { path: '/auth/signup', method: RequestMethod.POST },
        { path: '/auth/refresh', method: RequestMethod.POST },
      )
      .forRoutes(AuthController);
  }
}
