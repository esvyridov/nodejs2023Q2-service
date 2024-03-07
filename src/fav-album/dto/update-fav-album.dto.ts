import { PartialType } from '@nestjs/mapped-types';
import { CreateFavAlbumDto } from './create-fav-album.dto';

export class UpdateFavAlbumDto extends PartialType(CreateFavAlbumDto) {}
