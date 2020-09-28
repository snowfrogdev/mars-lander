import { LineSegment } from '../shared/line-segment';
import { clamp, radiansFrom } from '../shared/utils';
import { Vector } from '../shared/vector';
import { LanderData } from './lander-data';
import { Mars } from './mars';

export class Lander {
  private _previousPosition: Vector;
  private _lastMovement: LineSegment;

  get landerData(): LanderData {
    return new LanderData(
      this._position,
      this._lastMovement,
      this._fuel,
      this._rotationAngle,
      this._thrust,
      this._verticalSpeed,
      this._horizontalSpeed
    );
  }

  constructor(
    private _position: Vector,
    private _fuel: number,
    private _mars: Mars,
    private _onCollision: (landed: boolean) => void,
    private _horizontalSpeed = 0,
    private _verticalSpeed = 0,
    private _rotationAngle = 0,
    private _thrust = 0
  ) {
    this._previousPosition = _position;
    this._lastMovement = new LineSegment(this._previousPosition, this._position);
  }

  setRotationAngle(value: number) {
    if (value < -90 || value > 90) throw RangeError('Rotation angle should be -90 ≤ rotate ≤ 90 but was ' + value);
    this._rotationAngle = clamp(value, this._rotationAngle - 15, this._rotationAngle + 15);
  }

  setThrust(value: number) {
    if (value < 0 || value > 4) throw RangeError('Thrust should be 0 ≤ power ≤ 4 but was ' + value);
    this._thrust = clamp(value, this._thrust - 1, this._thrust + 1);
  }

  update() {
    this._move();
    this._consumeFuel();
    this._handleCollision();
  }

  private _move() {
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

  private _consumeFuel() {
    this._fuel -= this._thrust;
  }

  private _handleCollision() {
    const lastMovement = this.landerData.lastMovement;

    if (this._mars.hasCollisionWith(lastMovement)) {
      this._position = this._mars.getCollisionPointWith(lastMovement);
      this._lastMovement = new LineSegment(lastMovement.pointA, this._position);

      if (!this._mars.isOnLandingSite(lastMovement)) {
        // console.error('Failure: Mars Lander crashed on non-flat ground. Opportunity has been destroyed.');
        this._onCollision(false);
        return;
      }

      if (this._canLandSafely()) {
        this._onCollision(true);
        // console.error('Successful landing');
        return;
      }

      this._onCollision(false);
      /* console.error(
        'Failure: Mars Lander did not land in a safe position and speed and crashed. Opportunity has been destroyed.'
      ); */
    }

    if (this._mars.isMovingOutOfBounds(lastMovement)) {
      this._onCollision(false);
      // console.error('Failure: Out of bounds.');
    }
  }

  private _canLandSafely(): boolean {
    return this._rotationAngle === 0 && this._verticalSpeed <= 40 && this._horizontalSpeed <= 20;
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
