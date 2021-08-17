/* eslint-disable import/prefer-default-export */

type ChunkifyArrayArgs<T> = {
  chunkSize: number;
  elements: T[];
  options?: { redistribute?: boolean };
};

/**
 * Returns a 2D array chunked into arrays of size N.
 *
 * @param elements - Array of elements to chunk.
 * @param chunkSize - Size of the chunked arrays.
 *
 * @example
 * // Returns [[1, 2], [3, 4], [5, 6]].
 * chunkifyArray({ chunkSize: 2, elements: [1, 2, 3, 4, 5, 6] })
 */
export function chunkifyArray<T>({
  chunkSize,
  elements,
  options
}: ChunkifyArrayArgs<T>): T[][] {
  if (elements.length <= chunkSize) return [elements];

  const { redistribute = false } = options ?? {};
  const result: T[][] = [];

  elements.forEach((element: T, i: number) => {
    // Calculate the chunk index based on the element index and chunk size.
    const chunkIndex: number = Math.floor(i / chunkSize);

    // If no chunk exists with that chunk index yet, start a new chunk.
    if (!result[chunkIndex]) result[chunkIndex] = [];

    // Push the new item into the chunk!
    result[chunkIndex].push(element);
  });

  // If we don't want to redistribute the last chunk, return the result.
  if (!redistribute) return result;

  const lastChunkLength: number = result[result.length - 1].length;

  if (lastChunkLength < chunkSize - 1) {
    // Remove the last chunk from the array, so we can redistribute.
    const lastChunk: T[] = result.pop();

    lastChunk.forEach((element: T, i: number) => {
      // Calculate the chunk index based on the element index and chunk size.
      const chunkIndex: number = Math.floor(i / chunkSize);

      // Push the new item into the chunk!
      result[chunkIndex].push(element);
    });
  }

  return result;
}
