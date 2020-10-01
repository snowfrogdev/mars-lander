import { Genome } from './Genome';

export interface Initializer {
  run(): Genome[];
}

export interface FitnessCalculator {
  run(population: Genome[]): void;
}

export interface Selector {
  run(population: Genome[]): Genome[];
}

export interface Reproducer {
  run(population: Genome[]): Genome[];
}

export interface Mutater {
  run(population: Genome[]): void
}

export class GeneticAlgorithm {
  constructor(
    private _initializer: Initializer,
    private _fitnessCalculator: FitnessCalculator,
    private _selector: Selector,
    private _reproducer: Reproducer,
    private _mutater: Mutater
  ) { }
  
  run() {
    let population: Genome[] = this._initializer.run();
    
    while (true) {
      this._fitnessCalculator.run(population);

      if (false /* Termination criteria met*/) break;

      const selected = this._selector.run(population);

      const children = this._reproducer.run(selected);

      this._mutater.run(children);

      population = children;
    }
  }
}
