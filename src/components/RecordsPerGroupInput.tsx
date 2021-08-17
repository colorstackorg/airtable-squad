import React from 'react';

import { Table } from '@airtable/blocks/models';
import { FormField, InputSynced, useRecordIds } from '@airtable/blocks/ui';
import useStore from '../hooks/useStore';
import useTable from '../hooks/useTable';
import { FIELD } from '../util/constants';
import { Store } from '../util/types';

const RecordsPerGroupInput: React.FC = () => {
  const { tableId }: Store = useStore();
  const table: Table = useTable(tableId);
  const recordIds: string[] = useRecordIds(table);

  const description: string = recordIds?.length
    ? `Must be a number between 3 and ${Math.ceil(recordIds.length / 2)}.`
    : 'Must be a number greater than or equal to 3.';

  return (
    <FormField description={description} label="Number of People Per Group">
      <InputSynced
        required
        globalConfigKey={FIELD.RECORDS_PER_GROUP}
        min={3}
        step={1}
        type="number"
      />
    </FormField>
  );
};

export default RecordsPerGroupInput;
