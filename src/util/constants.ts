import { FieldType } from '@airtable/blocks/models';

export const allowedTypes: FieldType[] = [
  FieldType.CHECKBOX,
  FieldType.MULTIPLE_SELECTS,
  FieldType.NUMBER,
  FieldType.SINGLE_SELECT
];

export enum FIELD {
  ALGORITHM_FIELD_IDS = 'algorithmFieldIds',
  BY_ALGORITHM_FIELD_ID = 'byAlgorithmFieldId',
  PEOPLE_TABLE_ID = 'tableId',
  PREFERENCE_FIELD_ID = 'preferenceFieldId',
  RECORDS_PER_GROUP = 'recordsPerGroup'
}
