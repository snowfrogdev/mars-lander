import { Reproducer } from "../abstractions/abstractions";
import { Genome } from "../Genome";

export class OnePointReproducer implements Reproducer {
  constructor(private _crossoverPoint: number) {}
  run(population: Genome[]): Genome[] {
    const children: Genome[] = [];
    for (let i = 1; i < population.length; i += 2) {
      children.push(...this._crossover(population[i - 1], population[i]));
    }

    return children;
  }

  private _crossover(parent1: Genome, parent2: Genome): Genome[] {
    const index = Math.round((parent1.genes.length - 1) * this._crossoverPoint);
    const head1 = parent1.genes.slice(0, index);
    const tail1 = parent1.genes.slice(index);
    const head2 = parent2.genes.slice(0, index);
    const tail2 = parent2.genes.slice(index);

    const child1 = new Genome([...head1, ...tail2]);
    const child2 = new Genome([...head2, ...tail1]);
    return [child1, child2];
  };
}