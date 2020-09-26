import { LineSegment } from '../shared/line-segment';
import { clamp, radiansFrom } from '../shared/utils';
import { Vector } from '../shared/vector';

export class Lander {
  get rotationAngle() {
    return this._rotationAngle;
  }
  get thrust() {
    return this._thrust;
  }

  private _previousPosition: Vector;
  private _lastMovement: LineSegment;
  public get lastMovement(): LineSegment {
    return this._lastMovement;
  }
  public get position(): Vector {
    return this._position;
  }
  public get fuel(): number {
    return this._fuel;
  }

  constructor(
    private _position: Vector,
    private _fuel: number,
    private _horizontalSpeed = 0,
    private _verticalSpeed = 0,
    private _rotationAngle = 0,
    private _thrust = 0
  ) {
    this._previousPosition = _position;
    this._lastMovement = new LineSegment(this._previousPosition, this._position);
  }

  set rotationAngle(value: number) {
    if (value < -90 || value > 90) throw RangeError('Rotation angle should be -90 ≤ rotate ≤ 90 but was ' + value);
    this._rotationAngle = clamp(value, this._rotationAngle - 15, this._rotationAngle + 15);
  }

  set thrust(value: number) {
    if (value < 0 || value > 4) throw RangeError('Thrust should be 0 ≤ power ≤ 4 but was ' + value);
    this._thrust = clamp(value, this._thrust - 1, this._thrust + 1);
  }

  move() {
    const newHorizontalSpeed: number = this._computeHorizontalSpeed();
    const newVerticalSpeed: number = this._computeVerticalSpeed();
    const movement = new Vector(
      (newHorizontalSpeed + this._horizontalSpeed) / 2,
      (newVerticalSpeed + this._verticalSpeed) / 2
    );

    this._updatePosition(movement);

    this._horizontalSpeed = newHorizontalSpeed;
    this._verticalSpeed = newVerticalSpeed;
  }

  private _computeVerticalSpeed(): number {
    const verticalThrust = this._thrust * Math.cos(radiansFrom(this._rotationAngle));
    const gravity = 3.711;
    return this._verticalSpeed - gravity + verticalThrust;
  }

  private _computeHorizontalSpeed(): number {
    return this._horizontalSpeed - this._thrust * Math.sin(radiansFrom(this._rotationAngle));
  }

  private _updatePosition(movement: Vector) {
    const newPosition = this._position.add(movement);
    this._lastMovement = new LineSegment(this._position, newPosition);
    this._previousPosition = this._position;
    this._position = newPosition;
  }

  consumeFuel() {
    this._fuel -= this._thrust;
  }

  canLandSafely(): boolean {
    return this._rotationAngle === 0 && this._verticalSpeed <= 40 && this._horizontalSpeed <= 20;
  }

  setCollisionPoint(point: Vector): void {
    this._position = point;
  }

  toString(): string {
    const r = Math.round;
    const firstLine = `X=${r(this._position.x)}m, Y=${r(this._position.y)}m, HSpeed=${r(
      this._horizontalSpeed
    )}m/s, VSpeed=${r(this._verticalSpeed)}m/s`;
    const secondLine = `Fuel=${this._fuel}l, Angle=${this._rotationAngle}°, Power=${this._thrust} (${this._thrust}.0m/s2)`;

    return firstLine + '\n' + secondLine;
  }
}
