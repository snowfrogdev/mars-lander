import { Vector } from '../shared/vector';
import { Lander } from './lander';
import { Mars } from './mars';
import { Simulation } from './simulation';

const mars = new Mars([
  new Vector(0, 100),
  new Vector(1000, 500),
  new Vector(1500, 1500),
  new Vector(3000, 1000),
  new Vector(4000, 150),
  new Vector(5500, 150),
  new Vector(6999, 800),
]);

const lander = new Lander(new Vector(2500, 2700), 550);
const simulation = new Simulation(mars, lander);

while (!simulation.isOver) {
  if (simulation.turn < 20) {
    simulation.rotationAngle = -20;
    simulation.thrust = 3;
  } else if (simulation.turn < 39) {
    simulation.rotationAngle = 0;
    simulation.thrust = 3;
  } else {
    simulation.rotationAngle = 0;
    simulation.thrust = 4;
  }

  simulation.advance();
  console.log(simulation.toString() + '\n');
}
