import { Selector } from "../../../src/genetic-algorithm/genetic-algorithm";
import { Genome } from "../../../src/genetic-algorithm/Genome";

export class TruncateSelector implements Selector {
  constructor(private _cutoff = 0.5) {}
  run(population: Genome[]): Genome[] {
    return population.sort((a, b) => b.fitness! - a.fitness!).slice(0, population.length * this._cutoff);
  }
}
