import * as React from 'react';
import styled from 'styled-components';
import Button from 'yuai-buttons/dist/Button';
import { DataContext, ActionType } from '@src/app/contexts/DataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  width: 50%;
  height: 100%;
  padding: 12px;

  ${({ disabled }: { disabled: boolean }) => disabled && `
    opacity: 0.5;
    pointer-events: none;
  `}
`;
const StyledButton = styled(Button)`
  background: none;
  border: 1px solid ${({ theme }) => theme.borderColor};
  color: inherit;
  margin-right: 10px;
  padding: 5px 11px;

  &:hover {
    background: ${({ theme }) => theme.activeColor};
  }
`;

export default function LeftPanel() {
  const { state, dispatch } = React.useContext(DataContext);
  const selectedDatum = state.selectedId && state.data[state.selectedId];
  const beautify = async () => {
    dispatch({
      type: ActionType.SET_OPERATION,
      payload: {
        type: 'BEAUTIFY',
        from: { format: 'JSON' },
        to: { format: 'JSON', space: 2, stable: false }
      }
    });
  };

  return (
    <Container disabled={selectedDatum && selectedDatum.raw ? false : true}>
      <StyledButton onClick={beautify}><FontAwesomeIcon icon={faPlay} /> Beautify</StyledButton>
    </Container>
  );
}
