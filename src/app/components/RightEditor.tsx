import * as React from 'react';
import styled from 'styled-components';
import Editor from '@src/app/components/Editor';
import { DataContext } from '@src/app/contexts/DataContext';

const Container = styled.div`
  width: 50%;
  height: 100%;
  border-left: 1px solid ${({ theme }) => theme.borderColor};
`;

export default function RightEditor() {
  const { state } = React.useContext(DataContext);
  const result = state.selectedId && state.data[state.selectedId] && state.data[state.selectedId].result;

  return (
    <Container>
      <Editor name='RightEditor' value={result} readOnly={true} />
    </Container>
  );
}
