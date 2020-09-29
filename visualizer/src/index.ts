import { clamp, getRandomElementFrom, getRandomIntInclusive, loopFor } from '../../src/shared/utils';
import { Vector } from '../../src/shared/vector';
import { Simulation } from '../../src/simulation/simulation';

const canvas = <HTMLCanvasElement>document.getElementById('canvas');
const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
ctx.translate(0, canvas.height);
ctx.scale(1 / 7, -1 / 7);



const runButton = <HTMLButtonElement>document.getElementById('run');
runButton.addEventListener('click', optimize);
const stopButton = <HTMLButtonElement>document.getElementById('stop');
stopButton.addEventListener('click', stop);
const stepButton = <HTMLButtonElement>document.getElementById('step');
stepButton.addEventListener('click', () => getNextGeneration());
const resetButton = <HTMLButtonElement>document.getElementById('reset');
resetButton.addEventListener('click', reset);

const mars = [
  new Vector(0, 100),
  new Vector(1000, 500),
  new Vector(1500, 1500),
  new Vector(3000, 1000),
  new Vector(4000, 150),
  new Vector(5500, 150),
  new Vector(6999, 800),
];

const startingFuel = 550;
const startingPosition = new Vector(2500, 2700);

let bestScore = Infinity;
let averageScore = Infinity;
let generation = 0;
let simulations = 0;
let landed = false;

resetCanvas();


function resetCanvas() {
  ctx.clearRect(0, 0, canvas.width * 7, canvas.height * 7);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width * 7, canvas.height * 7);
  drawLandscape();
  drawStartPosition();
}

function drawStats() {
  ctx.save();
  ctx.scale(7, -7);
  ctx.translate(0, -canvas.height);
  ctx.font = '15px sans-serif';
  ctx.textAlign = 'start';
  ctx.fillText(`Simulations: ${simulations}`, 10, 20);
  ctx.fillText(`Generation: ${generation}`, 10, 40);
  ctx.fillText(`Best Score: ${bestScore}`, 10, 60);
  ctx.fillText(`Average Score: ${averageScore}`, 10, 80);
  ctx.fillText(`Landed: ${landed}`, 10, 100);
  ctx.restore();
}

let population = [...Array(100)].map(() => getInitialParams(100, 0, 0));

function reset() {
  bestScore = Infinity;
  averageScore = Infinity;
  generation = 0;
  simulations = 0;
  resetCanvas();

  population = [...Array(100)].map(() => getInitialParams(100, 0, 0));
}

let id: number;

function stop() {
  cancelAnimationFrame(id);
}

function optimize() {
  getNextGeneration(); 
  id = requestAnimationFrame(optimize);
  if (landed) cancelAnimationFrame(id);
}

function getNextGeneration() {
  resetCanvas();
  const sims = population.map((params) => new Simulation(mars, params, startingPosition, startingFuel));
  sims.forEach(sim => run(sim));
  landed = sims.some(sim => sim.hasLanded);
  sims.sort((a, b) => a.score - b.score);
  landed ? console.log(sims[0].params.toString()) : null;

  let newPopulation = crossover(sims);
  newPopulation = mutate(newPopulation);
  newPopulation[newPopulation.length - 1] = sims[0].params; //elitism;

  population = newPopulation;

  updateStats(sims);
}

function updateStats(sims: Simulation[]) {
  generation++;
  simulations += sims.length;
  bestScore = Math.round((sims[0].score + Number.EPSILON) * 100) / 100;
  averageScore = Math.round((sims.reduce((p, c) => p + c.score, 0) / sims.length + Number.EPSILON) * 100) / 100;
  drawStats();
}

function mutate(population: number[][]): number[][] {
  for (let genome of population) {
    for (let i = 0; i < genome.length; i++) {
      if (Math.random() < 0.50) {
        genome[i] = i % 2 === 0 ? randomRotation(genome[i - 2]) : randomThrust(genome[i - 2]) 
      }
    }
  }

  return population;
}

function randomRotation(previousRotation: number | undefined): number {
  const minRotation = clamp(previousRotation?? -90 - 15, -90, 90);
  const maxRotation = clamp(previousRotation?? 90 + 15, -90, 90);

  return getRandomIntInclusive(minRotation, maxRotation);
}

function randomThrust(previousThrust: number | undefined): number {
  const minThrust = clamp(previousThrust?? 0 - 1, 0, 4);
  const maxThrust = clamp(previousThrust?? 4 + 1, 0, 4);

  return getRandomIntInclusive(minThrust, maxThrust);
}

function crossover(sims: Simulation[]): number[][] {
  const topHalf: number[][] = sims
    .slice(0, sims.length / 2)
    .map((sim) => sim.params);
  
  /* const newPopulation = [...Array(sims.length)].map((_) => {
    const parentA = getRandomElementFrom(topHalf);
    const parentB = getRandomElementFrom(topHalf);
    const child = []

    for (let i = 0; i < parentA.length; i++) {
      child[i] = i % 2 === 0 ? parentA[i] : parentB[i]
    }

    return child;
  });
 */
  
  let newPopulation: number[][] = [];

  for (let i = 1; i < topHalf.length; i += 2) {
    if (!topHalf[i]) break;

    const parent1 = topHalf[i];
    const parent2 = topHalf[i - 1];
    const child1 = [];
    const child2 = [];

    for (let j = 0; j < topHalf[0].length; j++) {
      const random = Math.random();
      child1[j] = Math.round(random * parent1[j] + (1 - random) * parent2[j]);
      child2[j] = Math.round((1 - random) * parent1[j] + random * parent2[j]);
    }

    newPopulation.push(child1, child1, child2, child2);    
  }
  
  return newPopulation;
}

function run(simulation: Simulation) {
  simulation.run();
  const lastEntry = simulation.log[simulation.log.length - 1];
  const landingSpeeds = Math.abs(lastEntry.horizontalSpeed) <= 20 && Math.abs(lastEntry.verticalSpeed) <= 40;
  ctx.strokeStyle = 'white';
  if (landingSpeeds) ctx.strokeStyle = 'yellow';
  if (simulation.hasLanded) ctx.strokeStyle = 'green';
  ctx.lineWidth = 5;

  for (let entry of simulation.log) {    
    ctx.beginPath();
    ctx.moveTo(entry.lastMovement.pointA.x, entry.lastMovement.pointA.y);
    ctx.lineTo(entry.lastMovement.pointB.x, entry.lastMovement.pointB.y);
    ctx.stroke();
  }
}

function drawLandscape() {
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(mars[0].x, mars[0].y);
  for (let point of mars) {
    ctx.lineTo(point.x, point.y);
  }
  ctx.stroke();
}

function drawStartPosition() {
  ctx.strokeStyle = 'white';
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(startingPosition.x, startingPosition.y, 20, 0, 360);
  ctx.fill();
}

function getInitialParams(turns: number, initialRotation: number, initialThrust: number): number[] {
  const params: number[] = new Array(turns * 2);
  let minRotation: number;
  let maxRotation: number;
  let minThrust: number;
  let maxThrust: number;

  for (let i = 1; i < params.length; i += 2) {
    if (i === 1) {
      minRotation = clamp(initialRotation - 15, -90, 90);
      maxRotation = clamp(initialRotation + 15, -90, 90);
      minThrust = clamp(initialThrust - 1, 0, 4);
      maxThrust = clamp(initialThrust + 1, 0, 4);
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
