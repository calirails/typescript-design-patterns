import { Engineer } from "./../database/models/index";
import { TraversableDatabase } from "./visitor";

export class RankableStrategyDatabase<
  T extends Engineer
> extends TraversableDatabase<T> {
  public selectHighestRank(rankerStrategy: (item: T) => number): T | null {
    // starts off pointing to no one in particlar for reduce accumulator
    let selected: {
      rank: number;
      employee: T | null;
    } = { rank: -1, employee: null };

    // TODO!: consider if/how/when to simply reuse the inherited ::visit() method
    // to DRY out the visitor mechanism; even though this case is simplistic because
    // it relies on the Object.values(). What if ::visit() was much more complex?
    Object.values(this.dataStorage).reduce((acc, current) => {
      const currentRank = rankerStrategy(current);
      if (currentRank > acc.rank) {
        selected = { rank: currentRank, employee: current };
      }
      return acc;
    }, selected);

    return selected.employee;
  }
}
