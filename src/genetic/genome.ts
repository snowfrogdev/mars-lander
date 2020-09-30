export interface FitnessFunc {
  (): number;
}
export class Genome {
  public get genes(): ReadonlyArray<number> {
    return this._genes;
  }
  private _fitness = 0;
  constructor(private _genes: number[], private _fitnessFunc: FitnessFunc) { }

  fitness(): number {
    if (this._fitness)
      return this._fitness;

    this._fitness = this._fitnessFunc();
    return this._fitness;
  }
}
