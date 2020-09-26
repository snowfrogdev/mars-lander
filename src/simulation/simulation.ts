import { Lander } from './lander';
import { Mars } from './mars';

export class Simulation {
  private _isOver = false;
  private _hasLanded = false;
  public get isOver() {
    return this._isOver;
  }
  public get turn() {
    return this._turn;
  }

  constructor(private _mars: Mars, private _lander: Lander, private _turn = 0) {}

  set rotationAngle(value: number) {
    this._lander.rotationAngle = value;
  }

  set thrust(value: number) {
    this._lander.thrust = value;
  }

  advance() {
    if (this._isOver) {
      console.error('Simulation is over.');
      return;
    }
    this._turn++;

    this._lander.move();
    this._lander.consumeFuel();
    this._handleCollision();
  }

  private _handleCollision() {
    if (this._mars.hasCollisionWith(this._lander.lastMovement)) {
      this._lander.setCollisionPoint(this._mars.getCollisionPointWith(this._lander.lastMovement));
      this._isOver = true;
      if (!this._mars.isOnLandingSite(this._lander.lastMovement)) {
        console.error('Failure: Mars Lander crashed on non-flat ground. Opportunity has been destroyed.');
        return;
      }

      if (this._lander.canLandSafely()) {
        this._hasLanded = true;
        console.error('Successful landing');
        return;
      }

      console.error(
        'Failure: Mars Lander did not land in a safe position and speed and crashed. Opportunity has been destroyed.'
      );
    }

    if (this._mars.isMovingOutOfBounds(this._lander.lastMovement)) {
      this._isOver = true;
      console.error('Failure: Out of bounds.');
    }
  }

  toString(): string {
    return `Turn=${this._turn}` + '\n' + this._lander.toString();
  }
}
