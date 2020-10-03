import { Initializer } from "../../../src/genetic-algorithm/abstractions/abstractions";
import { Genome } from "../../../src/genetic-algorithm/Genome";
import { clamp, getRandomIntInclusive } from "../../../src/shared/utils";
import { Scenario } from "../../../src/simulation/scenario";

export class RandomInitializer implements Initializer {
  constructor(private _scenario: Scenario, private _populationSize: number) {}
  run(): Genome[] {
    return [...Array(this._populationSize)].map(() => new Genome(this._getInitialGenes()));
  }

  private _getInitialGenes(): number[] {
    const params: number[] = new Array(this._scenario.fuel / 5);
    let minRotation: number;
    let maxRotation: number;
    let minThrust: number;
    let maxThrust: number;

    for (let i = 1; i < params.length; i += 2) {
      if (i === 1) {
        minRotation = clamp(this._scenario.angle - 15, -90, 90);
        maxRotation = clamp(this._scenario.angle + 15, -90, 90);
        minThrust = clamp(this._scenario.power - 1, 0, 4);
        maxThrust = clamp(this._scenario.power + 1, 0, 4);
      } else {
        minRotation = clamp(params[i - 3] - 15, -90, 90);
        maxRotation = clamp(params[i - 3] + 15, -90, 90);
        minThrust = clamp(params[i - 2] - 1, 0, 4);
        maxThrust = clamp(params[i - 2] + 1, 0, 4);
      }

      params[i - 1] = getRandomIntInclusive(minRotation, maxRotation);
      params[i] = getRandomIntInclusive(minThrust, maxThrust);
    }

    return params;
  }
}
