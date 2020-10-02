import { FitnessCalculator } from '../../../src/genetic-algorithm/genetic-algorithm';
import { Genome } from '../../../src/genetic-algorithm/Genome';
import { spliceRandom } from '../../../src/shared/utils';
import { LanderData } from '../../../src/simulation/lander-data';
import { Scenario } from '../../../src/simulation/scenario';
import { Simulation } from '../../../src/simulation/simulation';

export class FitnessBiases {
  constructor(
    public hSpeed = 0.166666667,
    public vSpeed = 0.166666667,
    public angle = 0.166666667,
    public fuelBurned = 0.166666667,
    public distance = 0.166666667,
    public landed = 0.166666667
  ) {}

  static random(): FitnessBiases {
    const fitnessBiases = new FitnessBiases();
    let remainingBias = 1;
    const setters = [
      (value: number) => (fitnessBiases.hSpeed = value),
      (value: number) => (fitnessBiases.vSpeed = value),
      (value: number) => (fitnessBiases.angle = value),
      (value: number) => (fitnessBiases.fuelBurned = value),
      (value: number) => (fitnessBiases.distance = value),
      (value: number) => (fitnessBiases.landed = value),
    ];

    for (let i = 0; i < 6; i++) {
      if (i === 5) {
        setters[0](remainingBias);
        break;
      }
      const bias = Math.random();
      remainingBias -= bias;
      spliceRandom(setters)(bias);
    }

    return fitnessBiases;
  }
}

export class FitnessCalculatorImp implements FitnessCalculator {
  constructor(
    private _scenario: Scenario,
    private _biases: FitnessBiases,
    private _repoter?: (log: readonly LanderData[]) => void
  ) {}
  run(population: Genome[]): void {
    population.forEach((genome) => (genome.fitness = this._calculateFitness(genome)));
  }

  _calculateFitness(genome: Genome): number {
    const sim = new Simulation(
      this._scenario.mars,
      genome.genes,
      this._scenario.position,
      this._scenario.fuel,
      this._scenario.hSpeed,
      this._scenario.vSpeed,
      this._scenario.angle,
      this._scenario.power
    );

    sim.run();
    
    if (this._repoter) this._repoter(sim.log);

    const startingFuel = sim.log[0].fuel;
    const lastEntry = sim.log[sim.log.length - 1];
    const hSpeed = 1 - (Math.max(Math.abs(lastEntry.horizontalSpeed), 20) - 20) / (250 - 20);
    const vSpeed = 1 - (Math.max(Math.abs(lastEntry.verticalSpeed), 40) - 40) / (150 - 40);
    const angle = 1 - (Math.abs(lastEntry.rotationAngle) - 0) / (90 - 0);
    const fuelBurned = 1 - (startingFuel - lastEntry.fuel - 0) / (startingFuel - 0);
    const distance = 1 - (sim.distanceToLanding(lastEntry.position) - 0) / (7615 - 0);
    const landed = sim.hasLanded ? 1 : 0;

    return (
      hSpeed * this._biases.hSpeed +
      vSpeed * this._biases.vSpeed +
      angle * this._biases.angle +
      fuelBurned * this._biases.fuelBurned +
      distance * this._biases.distance +
      landed * this._biases.landed
    );
  }
}
