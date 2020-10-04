import { Genome } from '../Genome';


export interface Initializer {
  run(): Genome[];
}

export interface FitnessCalculator {
  run(population: Genome[]): void;
}

export interface ParentSelector {
  run(population: Genome[]): Genome[];
}

export interface Reproducer {
  run(population: Genome[]): Genome[];
}

export interface SurvivorSelector {
  run(population: Genome[], children: Genome[]): Genome[];
}

export interface Mutater {
  run(population: Genome[]): void;
}

export interface Terminator {
  shouldTerminate(generations: number, ellapsedTime: number, population: Genome[]): boolean;
}
