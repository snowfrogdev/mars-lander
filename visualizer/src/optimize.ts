import { GeneticAlgorithm } from '../../src/genetic-algorithm/genetic-algorithm';
import { clamp, getRandomArbitrary, getRandomIntInclusive, spliceRandom } from '../../src/shared/utils';
import { LanderData } from '../../src/simulation/lander-data';
import { FitnessBiases, FitnessCalculatorImp } from './algorithms/fitness-calculator';
import { RandomInitializer } from './algorithms/initializer';
import { MutaterImp } from './algorithms/mutater';
import { TruncateParentSelector } from './algorithms/parent-selector';
import { OnePointReproducer } from './algorithms/reproducer';
import { TruncateSurvivorSelector } from './algorithms/survivor-selector';
import { TerminatorImp } from './algorithms/terminator';
import { scenarios } from './data/scenarios';

const params = {
  populationSize: 0,
  truncateSelection: 0,
  crossoverPoint: 0,
  mutationRate: 0,
  hSpeedBias: { value: 0 },
  vSpeedBias: { value: 0 },
  angleBias: { value: 0 },
  fuelBias: { value: 0 },
  distanceBias: { value: 0 },
  landedBias: { value: 0 },
};

let hasLanded = false;

let scenario = 0;
let ga: GeneticAlgorithm;

let counter = 1;
export function optimize() {
  // Build GA with random params
  randomize();
  buildGA();

  // Run GA
  loop();

  function loop() {
    hasLanded = false;
    ga.run();

    // If GA success
    if (hasLanded) {
      console.log('Has landed');
      if (scenario === 4) {
        // We have found a winner
        console.log({ generations: ga.generations, bestScore: ga.bestScore, params });
        return;
      }

      // Run with same params but different scenario
      scenario++;
      loop();
      return;
    }

    // Failed, try again with new params
    console.log('GAs tried: ' + counter);
    counter++;
    setImmediate(optimize);
  }
}

function randomize() {
  params.populationSize = getRandomIntInclusive(150, 600);
  params.truncateSelection = getRandomIntInclusive(0, params.populationSize);
  params.crossoverPoint = getRandomArbitrary(0.5, 0.7);
  params.mutationRate = getRandomArbitrary(0.1, 0.3);

  const biases = [
    params.hSpeedBias,
    params.vSpeedBias,
    params.angleBias,
    params.fuelBias,
    params.distanceBias,
    params.landedBias,
  ];

  let remainingBias = 1;
  while (biases.length) {
    const bias = spliceRandom(biases);

    if (!biases.length) {
      bias.value = remainingBias;
      break;
    }

    const biasValue = getRandomArbitrary(0, clamp(remainingBias, 0, 0.6));
    bias.value = biasValue;
    remainingBias -= +bias.value;
  }
}

function buildGA() {
  const initializer = new RandomInitializer(scenarios[scenario], params.populationSize);
  const biases = new FitnessBiases(
    +params.hSpeedBias.value,
    +params.vSpeedBias.value,
    +params.angleBias.value,
    +params.fuelBias.value,
    +params.distanceBias.value,
    +params.landedBias.value
  );
  const fitnessCalc = new FitnessCalculatorImp(scenarios[scenario], biases, onSim);
  const parentSelector = new TruncateParentSelector(params.truncateSelection);
  const reproducer = new OnePointReproducer(params.crossoverPoint);
  const mutater = new MutaterImp(params.mutationRate);
  const survivorSelector = new TruncateSurvivorSelector();
  const terminator = new TerminatorImp(Infinity, 90);
  ga = new GeneticAlgorithm(
    initializer,
    fitnessCalc,
    parentSelector,
    reproducer,
    mutater,
    survivorSelector,
    terminator
  );
}

function onSim(log: readonly LanderData[]) {
  hasLanded = log[log.length - 1].hasLanded;
}

optimize();
