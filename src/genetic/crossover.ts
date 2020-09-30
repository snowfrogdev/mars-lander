import { FitnessFunc, Genome } from "./Genome";

function onePointCrossover(parent1: Genome, parent2: Genome, point = 0.5, fitnessFunc: FitnessFunc): Genome[] {
  const index = Math.round(parent1.genes.length - 1) * point;
  const head1 = parent1.genes.slice(0, index + 1);
  const tail1 = parent1.genes.slice(index);
  const head2 = parent2.genes.slice(0, index);
  const tail2 = parent2.genes.slice(index);

  const child1 = new Genome([...head1, ...tail2], fitnessFunc);
  const child2 = new Genome([...head2, ...tail1], fitnessFunc);
  return [child1, child2];
}

function weightedAverageCrossover(parent1: Genome, parent2: Genome, fitnessFunc: FitnessFunc): Genome[] {
  const child1 = [];
  const child2 = [];

  for (let j = 0; j < parent1.genes.length; j++) {
    const random = Math.random();
    child1[j] = Math.round(random * parent1.genes[j] + (1 - random) * parent2.genes[j]);
    child2[j] = Math.round((1 - random) * parent1.genes[j] + random * parent2.genes[j]);
  }

  return [new Genome(child1, fitnessFunc), new Genome(child2, fitnessFunc)];
}