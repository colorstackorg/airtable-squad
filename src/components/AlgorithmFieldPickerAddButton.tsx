import { nanoid } from 'nanoid';
import React from 'react';

import { GlobalConfig } from '@airtable/blocks/types';
import { TextButton, useGlobalConfig } from '@airtable/blocks/ui';
import useStore from '../hooks/useStore';
import { FIELD } from '../util/constants';
import { Store } from '../util/types';

const AlgorithmFieldPickerAddButton: React.FC = () => {
  const globalConfig: GlobalConfig = useGlobalConfig();
  const { algorithmFieldIds, tableId }: Store = useStore();

  /**
   * Adds a new algorithm field ID to the list.
   */
  const onClick = (): void => {
    globalConfig.setAsync(FIELD.ALGORITHM_FIELD_IDS, [
      ...algorithmFieldIds,
      nanoid()
    ]);
  };

  return (
    <TextButton
      disabled={!tableId}
      onClick={onClick}
      padding="8px 12px"
      width="fit-content"
    >
      + Add Field
    </TextButton>
  );
};

export default AlgorithmFieldPickerAddButton;
