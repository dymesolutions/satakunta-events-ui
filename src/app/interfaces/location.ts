import { IPosition } from '@app/interfaces/position';
import { Place } from '@app/models/place';

export interface ILocation {
  place: Place;
  extraInfo: string;
  position: IPosition;
}
