import { Base, Table } from '@airtable/blocks/models';
import { useBase } from '@airtable/blocks/ui';

/**
 * Returns the Table associated with the ID.
 */
const useTable = (tableId: string): Table | null => {
  const base: Base = useBase();
  return base.getTableByIdIfExists(tableId);
};

export default useTable;
