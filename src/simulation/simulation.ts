import { Vector } from '../shared/vector';
import { Lander } from './lander';
import { LanderData } from "./lander-data";
import { Mars } from './mars';

export class Simulation {
  public get params(): ReadonlyArray<number> {
    return this._params;
  }
  get isOver() {
    return this._isOver;
  }
  private _isOver = false;
  get log(): ReadonlyArray<LanderData> {
    return this._log;
  }
  private _log: LanderData[] = [];
  
  get turn() {
    return this._turn;
  }
  get hasLanded() {
    return this._hasLanded;
  }
  private _hasLanded = false;
  private _mars: Mars;
  private _lander: Lander;

  constructor(
    mars: Vector[],
    private _params: ReadonlyArray<number>,
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

  run(): void {
    for (let i = 1; i < this._params.length; i += 2) {
      this._lander.setRotationAngle(this._params[i - 1]);
      this._lander.setThrust(this._params[i]);
      this._advance();

      if (this.isOver) {
        break;
      }
    }
  }

  private _advance() {
    if (this._isOver) {
      console.error('Simulation is over.');
      return;
    }
    this._turn++;

    this._lander.update();
    this._log.push(this._lander.landerData);
  }

  public distanceToLanding(position: Vector): number {
    return this._mars.distanceFromLandingSite(position);
  }

  toString(): string {
    return `Turn=${this._turn}` + '\n' + this._lander.toString();
  }
}