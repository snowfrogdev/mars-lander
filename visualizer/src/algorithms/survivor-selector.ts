import { SurvivorSelector } from '../../../src/genetic-algorithm/abstractions/abstractions';
import { Genome } from '../../../src/genetic-algorithm/Genome';

export class TruncateSurvivorSelector implements SurvivorSelector {
  run(population: Genome[], children: Genome[]): Genome[] {
    const fittest = population.sort((a, b) => b.fitness! - a.fitness!).slice(0, population.length - children.length);
    return [...fittest, ...children];
  }
}

export class AgedBasedSurvivorSelector implements SurvivorSelector {
  constructor(private _eliteSurvivors: number) {}
  run(population: Genome[], children: Genome[]): Genome[] {
    const elite = population.sort((a, b) => b.fitness! - a.fitness!).slice(0, this._eliteSurvivors);
    const nonElite = population.slice(this._eliteSurvivors);
    const youngest = nonElite
      .sort((a, b) => a.age - b.age)
      .slice(0, population.length - children.length - this._eliteSurvivors);
    return [...elite, ...youngest, ...children];
  }
}
