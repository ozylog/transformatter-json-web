import * as React from 'react';
import styled from 'styled-components';
import Editor from '@src/app/components/Editor';
import { ItemsContext } from '@src/app/contexts/ItemsContext';

const Container = styled.div`
  width: 50%;
  height: 100%;
  border-left: 1px solid ${({ theme }) => theme.borderColor};
`;

export default function RightEditor() {
  const { state } = React.useContext(ItemsContext);
  const output = state.selectedId && state.items[state.selectedId] && state.items[state.selectedId].output;

  return (
    <Container>
      <Editor name='RightEditor' value={output} readOnly={true} />
    </Container>
  );
}
