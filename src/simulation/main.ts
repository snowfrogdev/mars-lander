import { loopFor } from "../shared/Utils";
import { Mars } from "./mars";
import { Point } from "./point";
import { Simulation } from "./simulation";

const mars = new Mars([
  new Point(0, 100),
  new Point(1000, 500),
  new Point(1500, 1500),
  new Point(3000, 1000),
  new Point(4000, 150),
  new Point(5500, 150),
  new Point(6999, 800),
])

const simulation = new Simulation(mars, new Point(2500, 2700), 550);

loopFor(73).turns(() => {
  simulation.rotationAngle = -20;
  simulation.thrust = 3;
  simulation.advance();
  console.log(simulation.toString() + '\n');
})