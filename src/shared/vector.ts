export class Vector {
  public get x(): number {
    return this._x;
  }
  public get y(): number {
    return this._y;
  }

  constructor(private _x: number, private _y: number) {}

  subtract(vector: Vector): Vector {
    return new Vector(this._x - vector._x, this._y - vector._y);
  }

  add(vector: Vector): Vector {
    return new Vector(this._x + vector.x, this._y + vector.y);
  }

  multiply(scalar: number): Vector {
    return new Vector(this.x * scalar, this._y * scalar);
  }

  crossProduct2D(vector: Vector): number {
    return this.x * vector.y - this.y * vector.x; 
  }
}