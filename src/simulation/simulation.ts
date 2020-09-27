import { Vector } from '../shared/vector';
import { Lander } from './lander';
import { LanderData } from "./lander-data";
import { Mars } from './mars';

export class Simulation {
  private _isOver = false;
  private _hasLanded = false;
  private _mars: Mars;
  private _lander: Lander;
  private _log: LanderData[] = [];

  get log(): ReadonlyArray<LanderData> {
    return this._log;
  }
  
  get fuel(): number {
    return this._lander.landerData.fuel;
  }
  get isOver() {
    return this._isOver;
  }

  get turn() {
    return this._turn;
  }

  constructor(
    mars: Vector[],
    position: Vector,
    fuel: number,
    horizontalSpeed = 0,
    verticalSpeed = 0,
    rotationAngle = 0,
    thrust = 0,
    private _turn = 0
  ) {
    this._mars = new Mars(mars.map((coords) => new Vector(coords.x, coords.y)));
    const onCollision = (landed: boolean) => {
      this._isOver = true;
      if (landed) this._hasLanded = true;
    };

    this._lander = new Lander(
      position,
      fuel,
      this._mars,
      onCollision,
      horizontalSpeed,
      verticalSpeed,
      rotationAngle,
      thrust
    );

    this._log.push(this._lander.landerData);
  }

  getScore(params: number[]): number {
    const startingFuel = this.fuel;
    for (let i = 1; i < params.length; i += 2) {
      this._lander.setRotationAngle(params[i - 1]);
      this._lander.setThrust(params[i]);
      this.advance();

      if (this.isOver) {
        break;
      }
    }

    return (this._distanceToLanding() + startingFuel - this.fuel) * (this._hasLanded ? 1 : 2);
  }

  advance() {
    if (this._isOver) {
      console.error('Simulation is over.');
      return;
    }
    this._turn++;

    this._lander.update();
    this._log.push(this._lander.landerData);
  }

  private _distanceToLanding(): number {
    return this._mars.distanceFromLandingSite(this._lander.landerData.position);
  }

  toString(): string {
    return `Turn=${this._turn}` + '\n' + this._lander.toString();
  }
}