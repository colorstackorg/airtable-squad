import omit from 'lodash.omit';

import { FieldType } from '@airtable/blocks/models';
import { AirtableFields, Costs, FormattedRecord } from '../util/types';

type AirtableFieldsArgs = { airtableFields: AirtableFields };

type RecordValueArgs = {
  /**
   * Stringified value of the first record.
   */
  value1: string;

  /**
   * Stringified value of the second record.
   */
  value2: string;
};

/**
 * Returns the cost for a "multiple select" field. We normalize the cost by the
 * maximum number of values.
 */
const computeCostForMultipleSelectField = ({
  value1,
  value2
}: RecordValueArgs) => {
  const values1: string[] = value1.split(', ');
  const values2: string[] = value2.split(', ');
  const maxResponses: number = Math.max(values1.length, values2.length);

  const totalScore: number = values1.reduce(
    (accumulator: number, currentValue: string) => {
      return values2.includes(currentValue) ? accumulator + 1 : accumulator;
    },
    0
  );

  // To ensure we don't return a score that is greater than 1, we divide
  // by the max number of responses.
  return -totalScore / (maxResponses || 1);
};

type FieldCostArgs = RecordValueArgs & { fieldType: FieldType };

/**
 * Returns the cost for a field between 2 records.
 */
const computeCostForField = ({
  fieldType,
  value1,
  value2
}: FieldCostArgs): number => {
  switch (fieldType) {
    case FieldType.MULTIPLE_SELECTS:
      return computeCostForMultipleSelectField({ value1, value2 });

    default:
      return value1 === value2 ? -1 : 0;
  }
};

type HasPreferenceFieldArgs = AirtableFieldsArgs & {
  record: Omit<FormattedRecord, 'id'>;
};

/**
 * Returns true if the preference is non-null and the record has that
 * preference. Returns false othwerwise.
 */
const hasPreferenceField = ({
  airtableFields,
  record: { preference, ...recordValues }
}: HasPreferenceFieldArgs): boolean => {
  if (!preference) return false;

  return Object.keys(recordValues).some((airtableFieldId: string) => {
    // If the one of the fields' name is the preference, return true!
    return airtableFields[airtableFieldId]?.name === preference;
  });
};

type DefaultWeightArgs = AirtableFieldsArgs & {
  multiplier: number;
  record: Omit<FormattedRecord, 'id'>;
};

const getDefaultWeight = ({
  airtableFields,
  multiplier,
  record
}: DefaultWeightArgs): number => {
  const hasPreference: boolean = hasPreferenceField({ airtableFields, record });

  // If 1 category, 1...
  // If 2 categories, 0.5...
  // If 5 categories, 0.2...
  const defaultWeight: number = 1 / Object.keys(airtableFields).length;

  /**
   * @todo Add documentation for this calculation b/c it's abstract right now.
   */
  const weightWithPreference: number =
    defaultWeight * (1 / (1 + defaultWeight * (multiplier - 1)));

  return hasPreference ? weightWithPreference : defaultWeight;
};

type ComputeCostForPairArgs = AirtableFieldsArgs & {
  record1: Omit<FormattedRecord, 'id'>;
  record2: Omit<FormattedRecord, 'id'>;
};

/**
 * Returns an cost between 0.0 and 1.0 based on the people data.
 *
 * @param record1 - Formatted data of the first record.
 * @param record2 - Formatted data of the second record.
 */
const computeCostForPair = ({
  airtableFields,
  record1: { preference: record1Preference, ...record1RecordValues },
  record2: { preference: record2Preference, ...record2RecordValues }
}: ComputeCostForPairArgs): [number, number] => {
  // These values are what we will end up returning.
  let record1Cost = 0;
  let record2Cost = 0;

  // Multiples the preferred field's affinity score.
  const PREFERENCE_MULTIPLIER = 3;

  const record1DefaultWeight: number = getDefaultWeight({
    airtableFields,
    multiplier: PREFERENCE_MULTIPLIER,
    record: { ...record1RecordValues, preference: record1Preference }
  });

  const record2DefaultWeight: number = getDefaultWeight({
    airtableFields,
    multiplier: PREFERENCE_MULTIPLIER,
    record: { ...record2RecordValues, preference: record2Preference }
  });

  Object.keys(airtableFields).forEach((airtableFieldId: string) => {
    const value1: string = record1RecordValues[airtableFieldId];
    const value2: string = record2RecordValues[airtableFieldId];

    const fieldName: string = airtableFields[airtableFieldId]?.name;
    const fieldType: FieldType = airtableFields[airtableFieldId]?.type;

    const costByField: number = computeCostForField({
      fieldType,
      value1,
      value2
    });

    const record1Weight: number =
      !!record1Preference && fieldName === record1Preference
        ? record1DefaultWeight * PREFERENCE_MULTIPLIER
        : record1DefaultWeight;

    const record2Weight: number =
      !!record2Preference && fieldName === record2Preference
        ? record2DefaultWeight * PREFERENCE_MULTIPLIER
        : record2DefaultWeight;

    record1Cost += costByField * record1Weight;
    record2Cost += costByField * record2Weight;
  });

  return [record1Cost, record2Cost];
};

type ComputeCostsArgs = AirtableFieldsArgs & { records: FormattedRecord[] };

/**
 * Returns the a map of costs for all of the given records and their
 * permutations.
 *
 * @example
 * ```js
 * // Returns [
 * //   [
 * //     { id: 'a', preferences: ['c', 'd'] },
 * //     { id: 'b', preferences: ['d', 'c'] }
 * //   ],
 * //   [
 * //     { id: 'c', preferences: ['a', 'b'] },
 * //     { id: 'd', preferences: ['b', 'a'] }
 * //   ]
 * // ].
 * computeCosts(
 *  [
 *    { id: 'a', '123': 'Male' },
 *    { id: 'b', '123': 'Female' }
 *  ],
 *  [
 *    { id: 'c', '123': 'Male' },
 *    { id: 'd', '123': 'Female' }
 *  ]
 * )
 * ```
 */
const computeCosts = ({ airtableFields, records }: ComputeCostsArgs): Costs => {
  const costs: Costs = records.reduce(
    (accumulator: Costs, { id }: FormattedRecord) => {
      accumulator[id] = {};
      return accumulator;
    },
    {}
  );

  for (let i = 0; i < records.length - 1; i += 1) {
    for (let j = 1; j < records.length; j += 1) {
      const record1: FormattedRecord = records[i];
      const record2: FormattedRecord = records[j];

      const [record1Cost, record2Cost]: [number, number] = computeCostForPair({
        airtableFields,
        record1: omit(record1, 'id'),
        record2: omit(record2, 'id')
      });

      costs[record1.id][record2.id] = record1Cost;
      costs[record2.id][record1.id] = record2Cost;
    }
  }

  return costs;
};

export default computeCosts;
