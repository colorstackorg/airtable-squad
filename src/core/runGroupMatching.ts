import { runSimulatedAnnealing } from '@rami-abdou/simulated-annealing';
import { Costs } from '../util/types';
import { chunkifyArray } from '../util/util';

type GroupMatchingArgs = {
  costs: Costs;
  recordsPerGroup: number;
};

export default function runGroupMatching({
  costs,
  recordsPerGroup = 4
}: GroupMatchingArgs): string[][] {
  const ids: string[] = Object.keys(costs);

  /**
   * Returns a deep copy of nested arrays.
   *
   * Copy the original groups so we can mutate the array with function scope,
   * producing 0 side-effects.
   */
  const copyState = (state: string[][]): string[][] => {
    const result: string[][] = state.reduce(
      (accumulator: string[][], group: string[]) => {
        accumulator.push([...group]);
        return accumulator;
      },
      []
    );

    return result;
  };

  /**
   * Returns an integer between the given range.
   */
  const generateRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  /**
   * Returns a 2-tuple of random numbers, each one being unique, meaning the
   * first element and second element cannot be the same.
   */
  const generateUniqueRandomNumbers = (
    min: number,
    max: number
  ): [number, number] => {
    const randomGroupOne: number = generateRandomNumber(min, max);
    let randomGroupTwo: number = randomGroupOne;

    while (randomGroupOne === randomGroupTwo) {
      randomGroupTwo = generateRandomNumber(min, max);
    }

    return [randomGroupOne, randomGroupTwo];
  };

  /**
   * Returns the permutated groups after making a small permutation (ie:
   * swapping elements 2 random arrays).
   *
   * @param groups 2-D array of groups.
   * @returns Groups with a small permutation.
   */
  const generateNewState = (groups: string[][]): string[][] => {
    const numGroups: number = groups.length;

    // If there are no groups populated return an empty array.
    if (!numGroups) return groups;

    // g1 represents the index of the first group to swap from...
    const [g1, g2]: [number, number] = generateUniqueRandomNumbers(
      0,
      numGroups - 1
    );

    // Copy the original groups so we can mutate the array with function scope,
    // producing 0 side-effects.
    const result: string[][] = copyState(groups);

    // i1 represents the index of the first element within group 1 to swap...
    const i1: number = generateRandomNumber(0, result[g1].length - 1);
    const i2: number = generateRandomNumber(0, result[g2].length - 1);

    // Execute the swap.
    const temp: string = result[g1][i1];
    result[g1][i1] = result[g2][i2];
    result[g2][i2] = temp;

    return result;
  };

  /**
   * Returns the cost (in other words the cost function).
   */
  const getCost = (state: string[][]): number => {
    const cost: number = state.reduce(
      (accumulator: number, group: string[]) => {
        let groupCost = 0;

        for (let i = 0; i < group.length - 1; i += 1) {
          for (let j = i + 1; j < group.length; j += 1) {
            // The 2 people may have different "costs" of being with each other,
            // b/c of the fact that they could have different preferences. So
            // we take the average when assessing the cost, since we won't be
            // looping over every permutation (ie: n-log-n, not n^2).
            const person1Cost: number = costs[group[i]][group[j]];
            const person2Cost: number = costs[group[j]][group[i]];
            const averageCost: number = (person1Cost + person2Cost) / 2;

            groupCost += averageCost;
          }
        }

        return accumulator + groupCost;
      },
      0
    );

    return cost;
  };

  const result: string[][] = runSimulatedAnnealing({
    copyState,
    generateNewState,
    getCost,
    initialState: chunkifyArray({
      chunkSize: recordsPerGroup,
      elements: ids,
      options: { redistribute: true }
    })
  });

  return result;
}
