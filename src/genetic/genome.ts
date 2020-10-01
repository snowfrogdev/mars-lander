interface FitnessFunc {
  (): number;
}
export class Genome {
  get genes(): ReadonlyArray<number> {
    return this._genes;
  }
  fitness: number | undefined;

  constructor(private _genes: number[]) { }
  
  setGene(index: number, value: number) {
    this._genes[index] = value;
  }
}
