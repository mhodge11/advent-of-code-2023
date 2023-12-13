import { WinConditionObject } from './WinConditionObject.ts';

export interface MapObject {
  time: number;
  distance: number;
  winConditions: WinConditionObject[];
}
