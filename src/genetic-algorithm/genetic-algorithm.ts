import { now } from '../shared/utils';
import {
  FitnessCalculator,
  Initializer,
  Mutater,
  ParentSelector,
  Reproducer,
  SurvivorSelector,
  Terminator,
} from './abstractions/abstractions';
import { Genome } from './Genome';

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
  private _isCompleted = false;
  get isCompleted() {
    return this._isCompleted;
  }

  constructor(
    private _initializer: Initializer,
    private _fitnessCalculator: FitnessCalculator,
    private _parentSelector: ParentSelector,
    private _reproducer: Reproducer,
    private _mutater: Mutater,
    private _survivorSelector: SurvivorSelector,
    private _terminator: Terminator
  ) {
    this._population = this._initializer.run();
  }

  run(): Genome {
    const start = now();

    while (!this._terminator.shouldTerminate(this._generations, now() - start, this._population)) {
      this.step();
    }

    return this._fittestGenome();
  }

  step(startTime: number = Infinity) {
    this._generations++;
    this._population.forEach((genome) => genome.incrementAge());

    this._fitnessCalculator.run(this._population);

    this._setBestScore();
    this._setAverageScore();

    if (this._terminator.shouldTerminate(this._generations, now() - startTime, this._population)) {
      this._isCompleted = true;
      return;
    }

    const selected = this._parentSelector.run(this._population);

    const children = this._reproducer.run(selected);

    this._mutater.run(children);

    const newPopulation = this._survivorSelector.run(this._population, children);

    this._population = newPopulation;
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
