import { clamp, radiansFrom } from '../shared/Utils';
import { Mars } from './mars';
import { Point } from './point';

export class Simulation {
  constructor(
    private _mars: Mars,
    private _lander: Point,
    private _fuel: number,
    private _horizontalSpeed = 0,
    private _verticalSpeed = 0,
    private _rotationAngle = 0,
    private _thrust = 0,
    private _turn = 0
  ) {}

  set rotationAngle(value: number) {
    if (value < -90 || value > 90) throw RangeError('Rotation angle should be -90 ≤ rotate ≤ 90 but was ' + value);
    this._rotationAngle = clamp(value, this._rotationAngle - 15, this._rotationAngle + 15);
  }

  set thrust(value: number) {
    if (value < 0 || value > 4) throw RangeError('Thrust should be 0 ≤ power ≤ 4 but was ' + value);
    this._thrust = clamp(value, this._thrust - 1, this._thrust + 1);
  }

  advance() {
    this._turn++;

    this._moveLander();
    this._consumeFuel();
  }

  private _moveLander() {
    const newHorizontalSpeed: number = this._computeHorizontalSpeed();
    const newVerticalSpeed: number = this._computeVerticalSpeed();
    this._lander.x += (newHorizontalSpeed + this._horizontalSpeed) / 2;
    this._lander.y += (newVerticalSpeed + this._verticalSpeed) / 2;

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

  private _consumeFuel() {
    this._fuel -= this._thrust;
  }

  toString(): string {
    const r = Math.round;
    const firstLine = `X=${r(this._lander.x)}m, Y=${r(this._lander.y)}m, HSpeed=${r(
      this._horizontalSpeed
    )}m/s, VSpeed=${r(this._verticalSpeed)}m/s`;
    const secondLine = `Fuel=${this._fuel}l, Angle=${this._rotationAngle}°, Power=${this._thrust} (${this._thrust}.0m/s2), Turn=${this._turn}`;

    return firstLine + '\n' + secondLine;
  }
}
