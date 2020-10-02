import * as PIXI from 'pixi.js';
import { GeneticAlgorithm } from '../../src/genetic-algorithm/genetic-algorithm';
import { LanderData } from '../../src/simulation/lander-data';
import { Scenario } from '../../src/simulation/scenario';
import { FitnessBiases, FitnessCalculatorImp } from './fitness-calculator';
import { RandomInitializer } from './initializer';
import { MutaterImp } from './mutater';
import { OnePointReproducer } from './reproducer';
import { scenarios } from './scenarios';
import { TruncateSelector } from './selector';
import { TerminatorImp } from './terminator';
import { colorNumber } from './third-party-wrappers/colorNumber';

const app = new PIXI.Application({ width: 1000, height: 429, antialias: true });
app.stage.position.y = app.renderer.height / app.renderer.resolution;
app.stage.scale.x = 1 / 7;
app.stage.scale.y = -1 / 7;
document.getElementById('view1')?.appendChild(app.view);

const scenarioSelect = <HTMLSelectElement>document.getElementById('scenario-select');
scenarioSelect.addEventListener('change', loadScenario);
const populationSize = <HTMLInputElement>document.getElementById('population-size');
populationSize.addEventListener('change', loadScenario);
const runButton = <HTMLButtonElement>document.getElementById('run');
runButton.addEventListener('click', run);
const stopButton = <HTMLButtonElement>document.getElementById('stop');
stopButton.addEventListener('click', stop);
const stepButton = <HTMLButtonElement>document.getElementById('step');
stepButton.addEventListener('click', getNextGeneration);
const resetButton = <HTMLButtonElement>document.getElementById('reset');
resetButton.addEventListener('click', reset);

for (let i = 0; i < scenarios.length; i++) {
  const option = document.createElement("option");
  option.value = i.toString();
  option.text = scenarios[i].name;
  scenarioSelect.appendChild(option);
}

let scenario: Scenario = scenarios[parseInt(scenarioSelect.value)];
let landscape = new PIXI.Graphics();
let trajectory = new PIXI.Graphics();
let ga: GeneticAlgorithm;

loadScenario();

function loadScenario() {
  const scenarioIndex = scenarioSelect.value;
  scenario = scenarios[parseInt(scenarioIndex)];
  resetCanvas();

  const initializer = new RandomInitializer(scenario, parseInt(populationSize.value));
  const biases = new FitnessBiases();
  const fitnessCalc = new FitnessCalculatorImp(scenario, biases, onSim);
  const selector = new TruncateSelector();
  const reproducer = new OnePointReproducer();
  const mutater = new MutaterImp();
  const terminator = new TerminatorImp(1000000, Infinity)
  ga = new GeneticAlgorithm(initializer, fitnessCalc, selector, reproducer, mutater, terminator);
}

function run() {
  app.ticker.add(getNextGeneration);
}

function stop() {
  app.ticker.remove(getNextGeneration);
}

function getNextGeneration() {
  resetCanvas();
  ga.step();
}

function reset() {
  loadScenario();
}

function resetCanvas() {
  clearCanvas();
  drawLandscape();
  drawStartPosition();
}

function onSim(log: readonly LanderData[]) {
  const lastEntry = log[log.length - 1];
  const landingSpeeds = Math.abs(lastEntry.horizontalSpeed) <= 20 && Math.abs(lastEntry.verticalSpeed) <= 40;
  trajectory.lineStyle(5, colorNumber('white'));
  if (landingSpeeds) trajectory.lineStyle(5, colorNumber('yellow'));
  if (lastEntry.hasLanded) trajectory.lineStyle(5, colorNumber('green'));

  for (let entry of log) {
    trajectory.moveTo(entry.lastMovement.pointA.x, entry.lastMovement.pointA.y);
    trajectory.lineTo(entry.lastMovement.pointB.x, entry.lastMovement.pointB.y);
    app.stage.addChild(trajectory);
  }
};

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

