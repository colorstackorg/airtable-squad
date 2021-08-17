import React from 'react';

import { Session } from '@airtable/blocks/models';
import {
  Box,
  colors,
  initializeBlock,
  Text,
  useSession
} from '@airtable/blocks/ui';
import AlgorithmFieldPickerList from './components/AlgorithmFieldPickerList';
import FinishAlgorithmButton from './components/FinishAlgorithmButton';
import PreferenceFieldPicker from './components/PreferenceFieldPicker';
import RecordsPerGroupInput from './components/RecordsPerGroupInput';
import TablePicker from './components/TablePicker';
import useInitStore from './hooks/useInitStore';

const AppPermissionErrorMessage: React.FC = () => {
  const session: Session = useSession();

  const hasPermissionToUpdateBase: boolean =
    session.hasPermissionToUpdateRecords();

  // Don't show error message if the user has permission to edit the base.
  if (hasPermissionToUpdateBase) return null;

  return (
    <Text style={{ color: colors.RED, marginTop: 16 }}>
      You do not have permissions to update records in this base, and thus
      cannot use this application.
    </Text>
  );
};

const App: React.FC = () => {
  const isInitialized: boolean = useInitStore();

  // If the store isn't initialized, wait for it.
  if (!isInitialized) return null;

  return (
    <Box style={{ padding: 16 }}>
      <TablePicker />
      <RecordsPerGroupInput />
      <AlgorithmFieldPickerList />
      <PreferenceFieldPicker />
      <FinishAlgorithmButton />
      <AppPermissionErrorMessage />
    </Box>
  );
};

initializeBlock(() => <App />);
