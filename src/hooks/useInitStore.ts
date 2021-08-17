import { nanoid } from 'nanoid';
import { useEffect } from 'react';

import { Session } from '@airtable/blocks/models';
import { GlobalConfig } from '@airtable/blocks/types';
import { useGlobalConfig, useSession } from '@airtable/blocks/ui';
import { FIELD } from '../util/constants';
import { Store } from '../util/types';
import useStore from './useStore';

/**
 * Returns true if the store is initialized OR if the user doesn't have
 * permissions to initialzize the store. Returns false, otherwise.
 */
const useInitStore = (): boolean => {
  const session: Session = useSession();
  const globalConfig: GlobalConfig = useGlobalConfig();
  const { algorithmFieldIds }: Store = useStore();

  const hasPermissions: boolean = session.hasPermissionToUpdateRecords();

  useEffect(() => {
    // No need to initialize if:
    // - user doesn't have the permissions to update the globalConfig.
    // - there are already fieldMappingIds.
    if (!hasPermissions || algorithmFieldIds) return;

    const initialAlgorithmFieldId: string = nanoid();

    globalConfig.setPathsAsync([
      { path: [FIELD.ALGORITHM_FIELD_IDS], value: [initialAlgorithmFieldId] },
      {
        path: [FIELD.BY_ALGORITHM_FIELD_ID],
        value: { [initialAlgorithmFieldId]: null }
      }
    ]);
  }, [algorithmFieldIds, globalConfig, hasPermissions, session]);

  return !hasPermissions || !!algorithmFieldIds?.length;
};

export default useInitStore;
