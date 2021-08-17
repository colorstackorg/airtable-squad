import { Field } from '@airtable/blocks/models';

/**
 * Maps the ID of an Airtable field to the name of the field and the type of
 * the field.
 */
export type AirtableFields = Record<string, Pick<Field, 'name' | 'type'>>;

/**
 * Maps the Airtable Record ID to a map of another Airtable Record
 * ID and the cost between the 2 respective Airtable Records.
 */
export type Costs = Record<string, Record<string, number>>;

export type FormattedRecord =
  /**
   * Maps the ID of an Airtable field to the record's stringified value of the
   * field, which could be nullable.
   */
  Record<string, string> & {
    /**
     * ID of the Airtable record.
     */
    id: string;

    /**
     * Name of the Airtable field within the table that the record wants to
     * weigh the most in the algorithm.
     */
    preference?: string;
  };

// GLOBAL STATE

/**
 * Global store of the application.
 */
export type Store = {
  /**
   * IDs representing each entry in the algorithm field list. Note that these
   * IDs do NOT represent that actual Airtable field ID, we just use these
   * in order to maintain order in the React list.
   */
  algorithmFieldIds: string[];

  /**
   * Lookup map of the algorithm field ID to the Airtable field ID.
   */
  byAlgorithmFieldId: Record<string, string>;

  /**
   * # of records per each group (on average).
   */
  recordsPerGroup: number;

  /**
   * Name of the preference Airtable field on the table, if it exists.
   */
  preferenceFieldId: string;

  /**
   * ID of the Airtable Table to match the people from.
   */
  tableId: string;
};

// MISCELLANEOUS TYPES

/**
 * Utility used for writing test cases with jest-in-case.
 */
export type TestObject<T = unknown, S = unknown> = {
  /**
   * Input arguments/data for a test case.
   */
  input: T;

  /**
   * Expected output for a test case.
   */
  output: S;
};
