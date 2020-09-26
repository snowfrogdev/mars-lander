import { clamp, getRandomIntInclusive } from '../shared/utils';
import { Vector } from '../shared/vector';
import { Lander } from './lander';
import { Mars } from './mars';
import { Simulation } from './simulation';


function getScore(params: number[]): number {
  const mars = new Mars([
    new Vector(0, 100),
    new Vector(1000, 500),
    new Vector(1500, 1500),
    new Vector(3000, 1000),
    new Vector(4000, 150),
    new Vector(5500, 150),
    new Vector(6999, 800),
  ]);
  const startingFuel = 550;
  const lander = new Lander(new Vector(2500, 2700), startingFuel);
  const simulation = new Simulation(mars, lander);

  for (let i = 1; i < params.length; i += 2) {
    simulation.rotationAngle = params[i - 1];
    simulation.thrust = params[i];
    simulation.advance();

    if (simulation.isOver) {
      break;
    }
  }

  return (simulation.distanceToLanding + startingFuel - simulation.fuel) * (simulation.hasLanded ? 1 : 2);
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


console.log(getScore(getInitialParams(100, 0, 0)));