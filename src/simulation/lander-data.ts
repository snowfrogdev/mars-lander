import { LineSegment } from '../shared/line-segment';
import { Vector } from '../shared/vector';

export class LanderData {
  constructor(
    readonly position: Vector,
    readonly lastMovement: LineSegment,
    readonly fuel: number,
    readonly rotationAngle: number,
    readonly thrust: number,
    readonly verticalSpeed: number,
    readonly horizontalSpeed: number,
    readonly hasLanded: boolean,
  ) { }
}
