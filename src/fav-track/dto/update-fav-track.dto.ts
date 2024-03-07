import { PartialType } from '@nestjs/mapped-types';
import { CreateFavTrackDto } from './create-fav-track.dto';

export class UpdateFavTrackDto extends PartialType(CreateFavTrackDto) {}
