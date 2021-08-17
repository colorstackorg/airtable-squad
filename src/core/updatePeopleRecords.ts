import { Table } from '@airtable/blocks/models';
import { chunkifyArray } from '../util/util';

type UpdatePersonRecordsArgs = {
  groups: string[][];
  groupRecordIds: string[];
  linkedFieldName: string;
  table: Table;
};

const updatePersonRecords = async ({
  groupRecordIds,
  groups,
  linkedFieldName,
  table
}: UpdatePersonRecordsArgs): Promise<void> => {
  const personRecordsToUpdate: unknown[] = groups.reduce(
    (accumulator: unknown[], group: string[], i: number) => {
      const groupRecordId: string = groupRecordIds[i];

      group.forEach((personId: string) => {
        accumulator.push({
          fields: { [linkedFieldName]: [{ id: groupRecordId }] },
          id: personId
        });
      });

      return accumulator;
    },
    []
  );

  const chunkedRecordsToUpdate:unknown[][] = chunkifyArray({ 
    chunkSize: 50,
    elements: personRecordsToUpdate,
  })

  for (let i = 0; i < chunkedRecordsToUpdate.length; i++) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await table.updateRecordsAsync(chunkedRecordsToUpdate[i]);
  }
};

export default updatePersonRecords;
