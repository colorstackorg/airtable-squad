import { Table } from '@airtable/blocks/models';

type CreateGroupRecordsArgs = { groups: string[][]; table: Table };

const createGroupRecords = async ({
  groups,
  table: groupTable
}: CreateGroupRecordsArgs): Promise<string[]> => {
  const groupRecords = groups.map((_, i: number) => {
    // Add 1 since the current i is zero-indexed.
    return { fields: { Name: `Group #${i + 1}` } };
  });

  return groupTable.createRecordsAsync(groupRecords);
};

export default createGroupRecords;
