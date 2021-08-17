import { Field, Table } from '@airtable/blocks/models';
import { AirtableFields } from '../util/types';

type AirtableFieldsArgs = {
  airtableFieldIds: string[];
  table: Table;
};

const getAirtableFields = ({
  airtableFieldIds,
  table
}: AirtableFieldsArgs): AirtableFields => {
  const result: AirtableFields = {};

  airtableFieldIds.forEach((airtableFieldId: string) => {
    const field: Field = table.getFieldByIdIfExists(airtableFieldId);
    if (field) result[airtableFieldId] = { name: field.name, type: field.type };
  });

  return result;
};

export default getAirtableFields;
