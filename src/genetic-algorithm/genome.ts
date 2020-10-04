interface FitnessFunc {
  (): number;
}
export class Genome {
  get genes(): ReadonlyArray<number> {
    return this._genes;
  }
  
  private _age = 0;
  public get age() : number {
    return this._age;
  }
  
  fitness: number | undefined;

  constructor(private _genes: number[]) { }
  
  setGene(index: number, value: number) {
    this._genes[index] = value;
  }

  incrementAge() {
    this._age++;
  }
}
