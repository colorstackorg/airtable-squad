import React from 'react';

import { FormField } from '@airtable/blocks/ui';
import useStore from '../hooks/useStore';
import { Store } from '../util/types';
import AlgorithmFieldPicker from './AlgorithmFieldPicker';
import AlgorithmFieldPickerAddButton from './AlgorithmFieldPickerAddButton';

const AlgorithmFieldPickerList: React.FC = () => {
  const { algorithmFieldIds }: Store = useStore();

  return (
    <FormField
      description="What fields do you want records to be matched on?"
      label="Fields for Algorithm"
    >
      <ul style={{ margin: 0, padding: 0 }}>
        {algorithmFieldIds.map((algorithmFieldId: string) => (
          <AlgorithmFieldPicker id={algorithmFieldId} key={algorithmFieldId} />
        ))}
      </ul>

      <AlgorithmFieldPickerAddButton />
    </FormField>
  );
};

export default AlgorithmFieldPickerList;
