import { Genome } from "./Genome";

export function rouletteWheelSelection(population: ReadonlyArray<Genome>): ReadonlyArray<Genome> {
  const totalFitness = population.reduce((p, c) => p + c.fitness(), 0);
  return population.map((_) => select(population, totalFitness));
}

function select(population: ReadonlyArray<Genome>, totalFitness: number): Genome {
  let seed = Math.floor(Math.random() * totalFitness);

  for (const genome of population) {
    const rate = genome.fitness();
    if (seed < rate) return genome;
    seed -= rate;
  }

  throw new RangeError();
}

export function truncationSelection(population: Genome[], cutoff = 0.5): Genome[] {
  return population.sort((a, b) => b.fitness() - a.fitness()).slice(0, population.length * cutoff);
}
