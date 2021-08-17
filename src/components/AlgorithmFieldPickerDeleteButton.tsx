import React from 'react';

import { GlobalConfig } from '@airtable/blocks/types';
import { colors, TextButton, useGlobalConfig } from '@airtable/blocks/ui';
import useStore from '../hooks/useStore';
import { FIELD } from '../util/constants';
import { Store } from '../util/types';

const AlgorithmFieldPickerDeleteButton: React.FC<{ id: string }> = ({
  id: algorithmFieldId
}) => {
  const globalConfig: GlobalConfig = useGlobalConfig();
  const { algorithmFieldIds }: Store = useStore();

  // Shouldn't be able to delete the field if there is only 1.
  if (algorithmFieldIds.length <= 1) return null;

  /**
   * Removes the field from the list of algorithm field IDs as well as the
   * mapping from the algorithm IDs to Airtable field IDs.
   */
  const onClick = (): void => {
    const filteredAlgorithmFieldIds: string[] = algorithmFieldIds.filter(
      (fieldId: string) => fieldId !== algorithmFieldId
    );

    globalConfig.setPathsAsync([
      { path: [FIELD.ALGORITHM_FIELD_IDS], value: filteredAlgorithmFieldIds },
      // Setting the value to undefined is the equivalent of removing the
      // path from the global config.
      {
        path: [FIELD.BY_ALGORITHM_FIELD_ID, algorithmFieldId],
        value: undefined
      }
    ]);
  };

  return (
    <TextButton
      style={{ color: colors.RED, marginLeft: 16 }}
      icon="trash"
      size="large"
      onClick={onClick}
    />
  );
};

export default AlgorithmFieldPickerDeleteButton;
