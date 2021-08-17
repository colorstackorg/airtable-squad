import { Record } from '@airtable/blocks/models';
import { FormattedRecord } from '../util/types';

type FormatRecordArgs = {
  airtableFieldIds: string[];
  preferenceFieldId: string;
  record: Record;
};

const formatRecord = ({
  airtableFieldIds,
  preferenceFieldId,
  record
}: FormatRecordArgs): FormattedRecord => {
  const personRecord: FormattedRecord = {
    id: record.id,
    preference: preferenceFieldId
      ? record.getCellValueAsString(preferenceFieldId)
      : null
  };

  airtableFieldIds.forEach((airtableFieldId: string) => {
    const value: string = record.getCellValueAsString(airtableFieldId);
    personRecord[airtableFieldId] = value;
  });

  return personRecord;
};

export default formatRecord;
