import { Mutater } from "../../../src/genetic-algorithm/abstractions/abstractions";
import { Genome } from '../../../src/genetic-algorithm/Genome';
import { clamp, getRandomIntInclusive } from '../../../src/shared/utils';

export class MutaterImp implements Mutater {
  constructor(private _mutationRate = 0.01) {}
  run(population: Genome[]): void {
    for (let genome of population) {
      const genes = genome.genes;
      for (let i = 0; i < genes.length; i++) {
        if (Math.random() < this._mutationRate) {
          const value = i % 2 === 0 ? this._randomRotation(genes[i - 2]) : this._randomThrust(genes[i - 2]);
          genome.setGene(i, value);
        }
      }
    }
  }

  private _randomRotation(previousRotation: number | undefined): number {
    const minRotation = clamp((previousRotation ?? -90) - 15, -90, 90);
    const maxRotation = clamp((previousRotation ?? 90) + 15, -90, 90);

    return getRandomIntInclusive(minRotation, maxRotation);
  }

  private _randomThrust(previousThrust: number | undefined): number {
    const minThrust = clamp((previousThrust ?? 0) - 1, 0, 4);
    const maxThrust = clamp((previousThrust ?? 4) + 1, 0, 4);

    return getRandomIntInclusive(minThrust, maxThrust);
  }
}
