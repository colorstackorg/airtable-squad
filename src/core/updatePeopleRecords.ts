import { Table } from '@airtable/blocks/models';

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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return table.updateRecordsAsync(personRecordsToUpdate);
};

export default updatePersonRecords;
