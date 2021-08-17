import { GlobalConfig } from '@airtable/blocks/types';
import { useGlobalConfig } from '@airtable/blocks/ui';
import { FIELD } from '../util/constants';
import { Store } from '../util/types';

/**
 * Returns the Store that is seralized from the global configuration within
 * the Airtable app.
 */
const useStore = (): Store => {
  const globalConfig: GlobalConfig = useGlobalConfig();

  const algorithmFieldIds: string[] = globalConfig.get(
    FIELD.ALGORITHM_FIELD_IDS
  ) as string[];

  const byAlgorithmFieldId: Record<string, string> = globalConfig.get(
    FIELD.BY_ALGORITHM_FIELD_ID
  ) as Record<string, string>;

  const recordsPerGroup: number = globalConfig.get(
    FIELD.RECORDS_PER_GROUP
  ) as number;

  const tableId: string = globalConfig.get(FIELD.PEOPLE_TABLE_ID) as string;

  const preferenceFieldId: string = globalConfig.get(
    FIELD.PREFERENCE_FIELD_ID
  ) as string;

  return {
    algorithmFieldIds,
    byAlgorithmFieldId,
    preferenceFieldId,
    recordsPerGroup,
    tableId
  };
};

export default useStore;
