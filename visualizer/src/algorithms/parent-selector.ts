import { ParentSelector } from "../../../src/genetic-algorithm/abstractions/abstractions";
import { Genome } from "../../../src/genetic-algorithm/Genome";

export class TruncateParentSelector implements ParentSelector {
  constructor(private _cutoff: number) {}
  run(population: Genome[]): Genome[] {
    return population.sort((a, b) => b.fitness! - a.fitness!).slice(0, this._cutoff);
  }
}
