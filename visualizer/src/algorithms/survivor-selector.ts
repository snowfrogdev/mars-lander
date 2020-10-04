import { SurvivorSelector } from '../../../src/genetic-algorithm/abstractions/abstractions';
import { Genome } from '../../../src/genetic-algorithm/Genome';

export class TruncateSurvivorSelector implements SurvivorSelector {
  run(population: Genome[], children: Genome[]): Genome[] {
    const fittest = population.sort((a, b) => b.fitness! - a.fitness!).slice(0, population.length - children.length);
    return [...fittest, ...children];
  }
}
