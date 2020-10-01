import { Selector } from "../../src/genetic/genetic-algorithm";
import { Genome } from "../../src/genetic/Genome";

export class TruncateSelector implements Selector {
  constructor(private _cutoff = 0.5) {}
  run(population: Genome[]): Genome[] {
    return population.sort((a, b) => b.fitness! - a.fitness!).slice(0, population.length * this._cutoff);
  }
}