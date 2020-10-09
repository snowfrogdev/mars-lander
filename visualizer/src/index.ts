import * as PIXI from 'pixi.js';
import { GeneticAlgorithm } from '../../src/genetic-algorithm/genetic-algorithm';
import { getRandomArbitrary, getRandomIntInclusive, spliceRandom } from '../../src/shared/utils';
import { LanderData } from '../../src/simulation/lander-data';
import { Scenario } from '../../src/simulation/scenario';
import { FitnessBiases, FitnessCalculatorImp } from './algorithms/fitness-calculator';
import { RandomInitializer } from './algorithms/initializer';
import { MutaterImp } from './algorithms/mutater';
import { TruncateParentSelector } from './algorithms/parent-selector';
import { OnePointReproducer } from './algorithms/reproducer';
import { TruncateSurvivorSelector } from './algorithms/survivor-selector';
import { TerminatorImp } from './algorithms/terminator';
import { scenarios } from './data/scenarios';
import { colorNumber } from './third-party-wrappers/colorNumber';
import { initializeText } from './ui/initialize-text';

const app = new PIXI.Application({ width: 1000, height: 429, antialias: true });
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.ROUND_PIXELS = true;
app.stage.position.y = app.renderer.height / app.renderer.resolution;
app.stage.scale.x = 1 / 7;
app.stage.scale.y = -1 / 7;
document.getElementById('view1')?.appendChild(app.view);

const scenarioSelect = <HTMLSelectElement>document.getElementById('scenario-select');
scenarioSelect.addEventListener('change', loadScenario);
const populationSize = <HTMLInputElement>document.getElementById('population-size');
populationSize.addEventListener('change', loadScenario);
const truncateSelection = <HTMLInputElement>document.getElementById('truncate-selection');
truncateSelection.addEventListener('change', loadScenario);
const crossoverPoint = <HTMLInputElement>document.getElementById('crossover-point');
crossoverPoint.addEventListener('change', loadScenario);
const mutationRate = <HTMLInputElement>document.getElementById('mutation-rate');
mutationRate.addEventListener('change', loadScenario);

for (let i = 0; i < scenarios.length; i++) {
  const option = document.createElement('option');
  option.value = i.toString();
  option.text = scenarios[i].name;
  scenarioSelect.appendChild(option);
}

const hSpeedBias = <HTMLInputElement>document.getElementById('h-speed-bias');
hSpeedBias.addEventListener('change', loadScenario);
const vSpeedBias = <HTMLInputElement>document.getElementById('v-speed-bias');
vSpeedBias.addEventListener('change', loadScenario);
const angleBias = <HTMLInputElement>document.getElementById('angle-bias');
angleBias.addEventListener('change', loadScenario);
const fuelBias = <HTMLInputElement>document.getElementById('fuel-bias');
fuelBias.addEventListener('change', loadScenario);
const distanceBias = <HTMLInputElement>document.getElementById('distance-bias');
distanceBias.addEventListener('change', loadScenario);
const landedBias = <HTMLInputElement>document.getElementById('landed-bias');
landedBias.addEventListener('change', loadScenario);
const totalBias = <HTMLInputElement>document.getElementById('total-bias');

const runButton = <HTMLButtonElement>document.getElementById('run');
runButton.addEventListener('click', run);
const stopButton = <HTMLButtonElement>document.getElementById('stop');
stopButton.addEventListener('click', stop);
const stepButton = <HTMLButtonElement>document.getElementById('step');
stepButton.addEventListener('click', getNextGeneration);
const resetButton = <HTMLButtonElement>document.getElementById('reset');
resetButton.addEventListener('click', reset);
const randomizeButton = <HTMLButtonElement>document.getElementById('randomize');
randomizeButton.addEventListener('click', randomize);

let scenario: Scenario = scenarios[parseInt(scenarioSelect.value)];
let landscape = new PIXI.Graphics();
let trajectory = new PIXI.Graphics();
let ga: GeneticAlgorithm;

export let bestScore = -Infinity;
export let averageScore = -Infinity;
export let generation = 0;
export let simulations = 0;
export let landed = false;

const { simText, generationText, bestScoreText, averageScoreText, landedText } = initializeText();

app.stage.addChild(simText, generationText, bestScoreText, averageScoreText, landedText);

loadScenario();

function loadScenario() {
  const scenarioIndex = scenarioSelect.value;
  scenario = scenarios[parseInt(scenarioIndex)];
  totalBias.value = (
    +hSpeedBias.value +
    +vSpeedBias.value +
    +angleBias.value +
    +fuelBias.value +
    +distanceBias.value +
    +landedBias.value
  ).toFixed(2);

  resetCanvas();

  const initializer = new RandomInitializer(scenario, parseInt(populationSize.value));
  const biases = new FitnessBiases(
    +hSpeedBias.value,
    +vSpeedBias.value,
    +angleBias.value,
    +fuelBias.value,
    +distanceBias.value,
    +landedBias.value
  );
  const fitnessCalc = new FitnessCalculatorImp(scenario, biases, onSim);
  const parentSelector = new TruncateParentSelector(+truncateSelection.value);
  const reproducer = new OnePointReproducer(+crossoverPoint.value);
  const mutater = new MutaterImp(+mutationRate.value);
  const survivorSelector = new TruncateSurvivorSelector();
  const terminator = new TerminatorImp(Infinity, 1250);
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

function run() {
  app.ticker.add(getNextGeneration);
}

function stop() {
  app.ticker.remove(getNextGeneration);
}

function getNextGeneration() {
  if (landed) stop();
  resetCanvas();
  ga.step();
  updateStats(ga);
}

function updateStats(ga: GeneticAlgorithm) {
  generation++;
  bestScore = Math.round((ga.bestScore + Number.EPSILON) * 100) / 100;
  averageScore = Math.round((ga.averageScore + Number.EPSILON) * 100) / 100;
  drawStats();
}

function reset() {
  bestScore = -Infinity;
  averageScore = -Infinity;
  generation = 0;
  simulations = 0;
  landed = false;
  loadScenario();
}

function randomize() {
  populationSize.value = getRandomIntInclusive(10, 1000).toString();
  truncateSelection.value = getRandomIntInclusive(0, +populationSize.value).toString();
  crossoverPoint.value = Math.random().toFixed(1);
  mutationRate.value = Math.random().toFixed(2);

  const biases = [hSpeedBias, vSpeedBias, angleBias, fuelBias, distanceBias, landedBias];

  let remainingBias = 1;
  while (biases.length) {
    const bias = spliceRandom(biases);

    if (!biases.length) {
      bias.value = remainingBias.toFixed(2);
      break;
    }

    const biasValue = getRandomArbitrary(0, remainingBias);
    bias.value = biasValue.toFixed(2);
    remainingBias -= +bias.value;
  }  
  reset();
}

function resetCanvas() {
  clearCanvas();
  drawLandscape();
  drawStartPosition();
  drawStats();
}

function onSim(log: readonly LanderData[]) {
  simulations++;
  const lastEntry = log[log.length - 1];
  const landingSpeeds = Math.abs(lastEntry.horizontalSpeed) <= 20 && Math.abs(lastEntry.verticalSpeed) <= 40;
  trajectory.lineStyle(5, colorNumber('white'));
  if (landingSpeeds) trajectory.lineStyle(5, colorNumber('yellow'));
  if (lastEntry.hasLanded) {
    trajectory.lineStyle(5, colorNumber('green'));
    landed = true;
  }

  for (let entry of log) {
    trajectory.moveTo(entry.lastMovement.pointA.x, entry.lastMovement.pointA.y);
    trajectory.lineTo(entry.lastMovement.pointB.x, entry.lastMovement.pointB.y);
    app.stage.addChild(trajectory);
  }
}

function clearCanvas() {
  landscape.clear();
  trajectory.clear();
}

function drawLandscape() {
  landscape.lineStyle(5, colorNumber('red'));
  landscape.moveTo(scenario.mars[0].x, scenario.mars[0].y);
  for (let point of scenario.mars) {
    landscape.lineTo(point.x, point.y);
  }
  app.stage.addChild(landscape);
}

function drawStartPosition() {
  landscape.lineStyle(5, colorNumber('white'));
  landscape.beginFill(colorNumber('white'));
  landscape.drawCircle(scenario.position.x, scenario.position.y, 20);
  landscape.endFill();
}

function drawStats() {
  simText.text = `Simulations: ${simulations}`;
  generationText.text = `Generation: ${generation}`;
  bestScoreText.text = `Best Score: ${bestScore}`;
  averageScoreText.text = `Average Score: ${averageScore}`;
  landedText.text = `Landed: ${landed}`;
}
