import { PartialType } from '@nestjs/mapped-types';
import { CreateFavArtistDto } from './create-fav-artist.dto';

export class UpdateFavArtistDto extends PartialType(CreateFavArtistDto) {}
