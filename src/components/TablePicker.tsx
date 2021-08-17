import React from 'react';

import { Table } from '@airtable/blocks/models';
import {
  colors,
  FormField,
  TablePickerSynced,
  Text
} from '@airtable/blocks/ui';
import useStore from '../hooks/useStore';
import useTable from '../hooks/useTable';
import { FIELD } from '../util/constants';
import { Store } from '../util/types';

const TablePickerPermissionErrorMessage: React.FC = () => {
  const { tableId }: Store = useStore();
  const table: Table = useTable(tableId);

  // Don't show error message if user has permission to update the table.
  if (!table || !!table?.hasPermissionToUpdateRecords()) {
    return null;
  }

  return (
    <Text textColor={colors.RED} style={{ marginTop: 8 }}>
      You do not have permission to update this table.
    </Text>
  );
};

const TablePicker: React.FC = () => (
  <FormField
    description="Pick the table of records that you want to squad up."
    label="Table"
  >
    <TablePickerSynced globalConfigKey={FIELD.PEOPLE_TABLE_ID} />
    <TablePickerPermissionErrorMessage />
  </FormField>
);

export default TablePicker;
