import * as React from 'react';
import styled from 'styled-components';
import Editor from '@src/app/components/Editor';
import { DataContext, ActionType } from '@src/app/contexts/DataContext';

const Container = styled.div`
  width: 50%;
  height: 100%;
`;

export default function LeftEditor() {
  const { state, dispatch } = React.useContext(DataContext);
  const onChange = (value: string) => {
    dispatch({ type: ActionType.SET_RAW, payload: value });
  }

  const value = state.selectedId && state.data[state.selectedId] ? state.data[state.selectedId].raw : '';

  return (
    <Container>
      <Editor name='LeftEditor' value={value} onChange={onChange} />
    </Container>
  );
}
