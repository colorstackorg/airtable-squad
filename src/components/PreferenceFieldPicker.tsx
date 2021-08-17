import React from 'react';

import { FieldType, Table } from '@airtable/blocks/models';
import { FieldPickerSynced, FormField } from '@airtable/blocks/ui';
import useStore from '../hooks/useStore';
import useTable from '../hooks/useTable';
import { FIELD } from '../util/constants';
import { Store } from '../util/types';

const PreferenceFieldPicker: React.FC = () => {
  const { tableId }: Store = useStore();
  const table: Table = useTable(tableId);

  return (
    <FormField
      description="If records can choose their most weighted input for their matching, please select the field that stores that preference."
      label="Preference Field (Optional)"
    >
      <FieldPickerSynced
        shouldAllowPickingNone
        allowedTypes={[FieldType.SINGLE_SELECT]}
        disabled={!tableId}
        globalConfigKey={FIELD.PREFERENCE_FIELD_ID}
        placeholder={`Pick a field from ${table?.name}...`}
        table={table}
      />
    </FormField>
  );
};

export default PreferenceFieldPicker;
