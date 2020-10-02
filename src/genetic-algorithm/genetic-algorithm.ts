import { now } from '../shared/utils';
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

export interface Terminator {
  shouldTerminate(generations: number, ellapsedTime: number, population: Genome[]): boolean;
}

export class GeneticAlgorithm {
  private _population: Genome[];
  private _generations = 0;
  get generations() {
    return this._generations;
  }
  private _bestScore = -Infinity;
  get bestScore() {
    return this._bestScore;
  }
  private _averageScore = -Infinity;
  get averageScore() {
    return this._averageScore;
  }
  
  constructor(
    private _initializer: Initializer,
    private _fitnessCalculator: FitnessCalculator,
    private _selector: Selector,
    private _reproducer: Reproducer,
    private _mutater: Mutater,
    private _terminator: Terminator
  ) { 
    this._population = this._initializer.run();
  }
  
  run(): Genome {
    const start = now();        
    
    while (!this._terminator.shouldTerminate(this._generations, performance.now() - start, this._population)) {
      this.step();
    }

    return this._fittestGenome();
  }

  step(startTime: number = Infinity) {
    this._generations++;
    this._fitnessCalculator.run(this._population);

    this._setBestScore();
    this._setAverageScore();

    if (this._terminator.shouldTerminate(this._generations, performance.now() - startTime, this._population)) {
      return;
    };

    const selected = this._selector.run(this._population);

    const children = this._reproducer.run(selected);

    this.adjustPopulationSize(children);

    this._mutater.run(children);

    children[children.length - 1] = this._fittestGenome();

    this._population = children;
  }

  private adjustPopulationSize(children: Genome[]) {
    if (children.length < this._population.length) {
      const difference = this._population.length - children.length;
      children.push(...children.slice(0, difference));
    }
  }

  private _fittestGenome(): Genome {
    return this._population.sort((a, b) => b.fitness! - a.fitness!)[0];
  }

  private _setBestScore(): void {
    this._bestScore = this._fittestGenome().fitness!;
  }

  private _setAverageScore(): void {
    this._averageScore = this._population.reduce((p, c) => p + c.fitness!, 0) / this._population.length;
  }
}
