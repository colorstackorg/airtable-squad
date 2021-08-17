import day from 'dayjs';
import React from 'react';

import { Base, FieldType, Record, Table } from '@airtable/blocks/models';
import { Button, useBase, useRecords } from '@airtable/blocks/ui';
import computeCosts from '../core/computeCosts';
import createGroupRecords from '../core/createGroupRecords';
import formatRecord from '../core/formatRecord';
import getAirtableFields from '../core/getAirtableFields';
import runGroupMatching from '../core/runGroupMatching';
import updatePersonRecords from '../core/updatePeopleRecords';
import useStore from '../hooks/useStore';
import useTable from '../hooks/useTable';
import { AirtableFields, Costs, FormattedRecord, Store } from '../util/types';

const FinishAlgorithmButton: React.FC = () => {
  const {
    algorithmFieldIds,
    byAlgorithmFieldId,
    recordsPerGroup,
    tableId,
    preferenceFieldId
  }: Store = useStore();

  const base: Base = useBase();
  const table: Table = useTable(tableId);
  const records: Record[] = useRecords(table);

  const areAlgorithmFieldIdsReady: boolean = algorithmFieldIds.every(
    (algorithmFieldId: string) => {
      return !!byAlgorithmFieldId[algorithmFieldId];
    }
  );

  const onClick = async (): Promise<void> => {
    const airtableFieldIds: string[] = Object.values(byAlgorithmFieldId);

    // Format the records.
    const formattedRecords: FormattedRecord[] = records.map(
      (record: Record) => {
        return formatRecord({ airtableFieldIds, preferenceFieldId, record });
      }
    );

    // Get the Airtable fields map.
    const airtableFields: AirtableFields = getAirtableFields({
      airtableFieldIds,
      table
    });

    // Create the costs map.
    const costs: Costs = computeCosts({
      airtableFields,
      records: formattedRecords
    });

    // Pass the costs and # of records per group into simulated annealing.
    const groups: string[][] = runGroupMatching({ costs, recordsPerGroup });

    // Create the group table.
    const groupTable: Table = await base.createTableAsync(
      `${day().format()} SquadUp!`,
      [{ name: 'Name', type: FieldType.SINGLE_LINE_TEXT }]
    );

    await groupTable.createFieldAsync(
      table.name,
      FieldType.MULTIPLE_RECORD_LINKS,
      { linkedTableId: table.id }
    );

    // Create group records for # of groups there are.
    const groupRecordIds: string[] = await createGroupRecords({
      groups,
      table: groupTable
    });

    // Update the records and link them to the group records.
    await updatePersonRecords({
      groupRecordIds,
      groups,
      linkedFieldName: groupTable.name,
      table
    });
  };

  return (
    <Button
      disabled={!tableId || !areAlgorithmFieldIdsReady}
      icon="check"
      onClick={onClick}
      variant="primary"
    >
      Finish
    </Button>
  );
};

export default FinishAlgorithmButton;
