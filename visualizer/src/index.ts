import * as PIXI from 'pixi.js';
import { GeneticAlgorithm } from '../../src/genetic/genetic-algorithm';
import { Scenario } from '../../src/simulation/scenario';
import { FitnessBiases, FitnessCalculatorImp } from './fitness-calculator';
import { RandomInitializer } from './initializer';
import { MutaterImp } from './mutater';
import { OnePointReproducer } from './reproducer';
import { scenarios } from './scenarios';
import { TruncateSelector } from './selector';
import { colorNumber } from './third-party-wrappers/colorNumber';

const app = new PIXI.Application({ width: 1000, height: 429, antialias: true });
app.stage.position.y = app.renderer.height / app.renderer.resolution;
app.stage.scale.x = 1 / 7;
app.stage.scale.y = -1 / 7;
document.getElementById('view1')?.appendChild(app.view);

const scenarioSelect = <HTMLSelectElement>document.getElementById('scenario-select');
scenarioSelect.addEventListener('change', changeScenario);
const runButton = <HTMLButtonElement>document.getElementById('run');
// runButton.addEventListener('click', optimize);
const stopButton = <HTMLButtonElement>document.getElementById('stop');
// stopButton.addEventListener('click', stop);
const stepButton = <HTMLButtonElement>document.getElementById('step');
// stepButton.addEventListener('click', () => getNextGeneration());
const resetButton = <HTMLButtonElement>document.getElementById('reset');
// resetButton.addEventListener('click', reset);

for (let i = 0; i < scenarios.length; i++) {
  const option = document.createElement("option");
  option.value = i.toString();
  option.text = scenarios[i].name;
  scenarioSelect.appendChild(option);
}

let scenario: Scenario = scenarios[parseInt(scenarioSelect.value)];

update();

function changeScenario(e: Event) {
  const scenarioIndex = (<HTMLSelectElement>e.target).value;
  scenario = scenarios[parseInt(scenarioIndex)];
  update();

  const initializer = new RandomInitializer(scenario, 100);
  const biases = new FitnessBiases();
  const fitnessCalc = new FitnessCalculatorImp(scenario, biases);
  const selector = new TruncateSelector();
  const reproducer = new OnePointReproducer();
  const mutater = new MutaterImp();
  const ga = new GeneticAlgorithm(initializer, fitnessCalc, selector, reproducer, mutater);
}

function update() {
  clearCanvas();
  drawLandscape();
  drawStartPosition();
}



function clearCanvas() {
  app.stage.children.forEach((displayObject) =>
    (<PIXI.Container>displayObject).destroy({ children: true, texture: true })
  );
  app.stage.removeChildren();
}

function drawLandscape() {
  const landScape = new PIXI.Graphics();
  landScape.lineStyle(5, colorNumber('red'));
  landScape.moveTo(scenario.mars[0].x, scenario.mars[0].y);
  for (let point of scenario.mars) {
    landScape.lineTo(point.x, point.y);
  }
  app.stage.addChild(landScape);
}

function drawStartPosition() {
  const lander = new PIXI.Graphics();
  lander.beginFill(colorNumber('white'));
  lander.drawCircle(scenario.position.x, scenario.position.y, 20)
  lander.endFill();
  app.stage.addChild(lander);
}

