import { clamp, getRandomIntInclusive } from "../../src/shared/utils";
import { Vector } from "../../src/shared/vector";
import { Simulation } from "../../src/simulation/simulation";

const canvas = <HTMLCanvasElement>document.getElementById('canvas');
const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.translate(0, canvas.height);
ctx.scale(1 / 7, -1 / 7);

const runButton = <HTMLButtonElement>document.getElementById('run');
runButton.addEventListener('click', run);

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
const startingPosition = new Vector(2500, 2700)
  

drawLandscape();
drawStartPosition();




function run() {
  const simulation = new Simulation(mars, startingPosition, startingFuel);
  const score = simulation.getScore(getInitialParams(100, 0, 0));

  for (let entry of simulation.log) {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(entry.lastMovement.pointA.x, entry.lastMovement.pointA.y);
    console.log(entry);
    ctx.lineTo(entry.lastMovement.pointB.x, entry.lastMovement.pointB.y);
    ctx.stroke();
  }

  console.log(score);
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
