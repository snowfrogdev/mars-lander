import { Vector } from '../shared/vector';

export class Scenario {
  constructor(
    public name: string,
    public mars: Vector[],
    public position: Vector,
    public hSpeed: number,
    public vSpeed: number,
    public fuel: number,
    public angle: number,
    public power: number
  ) {}
}
