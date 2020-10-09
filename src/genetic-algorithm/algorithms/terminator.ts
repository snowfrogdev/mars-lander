import { Terminator } from "../abstractions/abstractions";
import { Genome } from "../Genome";

export class TerminatorImp implements Terminator  {
  constructor(private maxSimulations: number, private maxEllapsedTime: number) {}
  shouldTerminate(generations: number, ellapsedTime: number, population: Genome[]): boolean {
    return generations * population.length > this.maxSimulations || ellapsedTime > this.maxEllapsedTime;
  }

}