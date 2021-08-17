import React from 'react';

import { Table } from '@airtable/blocks/models';
import { FieldPickerSynced } from '@airtable/blocks/ui';
import useStore from '../hooks/useStore';
import useTable from '../hooks/useTable';
import { allowedTypes, FIELD } from '../util/constants';
import { Store } from '../util/types';
import AlgorithmFieldPickerDeleteButton from './AlgorithmFieldPickerDeleteButton';

const AlgorithmFieldPicker: React.FC<{ id: string }> = ({
  id: algorithmFieldId
}) => {
  const { tableId }: Store = useStore();
  const table: Table = useTable(tableId);

  const listItemStyle: React.CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8
  };

  return (
    <li style={listItemStyle}>
      <FieldPickerSynced
        allowedTypes={allowedTypes}
        disabled={!tableId}
        globalConfigKey={[FIELD.BY_ALGORITHM_FIELD_ID, algorithmFieldId]}
        placeholder={`Pick a field from ${table?.name}...`}
        table={table}
      />

      <AlgorithmFieldPickerDeleteButton id={algorithmFieldId} />
    </li>
  );
};

export default AlgorithmFieldPicker;
