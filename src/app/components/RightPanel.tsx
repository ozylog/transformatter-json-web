import get from 'lodash.get';
import * as React from 'react';
import styled from 'styled-components';
import { Button, ButtonGroup } from 'yuai-buttons';
import { faCopy, faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DataContext, ActionType } from '@src/app/contexts/DataContext';
import copy from 'copy-to-clipboard';

const Container = styled.div`
  width: 50%;
  height: 100%;
  border-left: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;
  justify-content: space-between;

  ${({ disabled }: { disabled: boolean }) => disabled && `
    opacity: 0.5;
    pointer-events: none;
  `}
`;
const BoxLeft = styled.div`
  width: 50%;
  padding: 12px;
`;
const BoxRight = styled(BoxLeft)`
  text-align: right;
`;
const Option = styled.span`
  margin-right: 10px;
`;
const PreLabel = styled.span`
  padding: 5px 9px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 3px 0 0 3px;
`;
const SpaceInput = styled.input`
  padding: 5px 9px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-left: 0;
  border-radius: 0 3px 3px 0;
  font-family: Roboto Mono;
  font-size: inherit;
  color: inherit;
  width: 30px;
  background: ${({ theme }) => theme.inputColor};
`;
const StableInput = styled.span`
  background: ${({ theme }) => theme.inputColor};
  border: 1px solid ${({ theme }) => theme.borderColor};
  padding: 5px 9px;
  border-radius: 0 3px 3px 0;
`;
const StyledButton = styled(Button)`
  background: none;
  border: 1px solid ${({ theme }) => theme.borderColor};
  color: inherit;
  padding: 5px 11px;

  &:hover {
    background: ${({ theme }) => theme.activeColor};
  }
`;
const Copied = styled.span`
  opacity: 0;
  margin-right: 10px;

  &.animate {
    -webkit-animation: fadeinout 4s linear forwards;
    animation: fadeinout 1s linear forwards;
    @-webkit-keyframes fadeinout {
      0%,100% { opacity: 0; }
      10% { opacity: 1; }
    }

    @keyframes fadeinout {
      0%,100% { opacity: 0; }
      10% { opacity: 1; }
    }
  }
}
`;

export default function RightPanel() {
  const { state, dispatch } = React.useContext(DataContext);
  const selectedDatum = state.selectedId && state.data[state.selectedId];
  const rawSpace = get(selectedDatum, 'operation.to.space');
  const space = rawSpace == null ? '' : rawSpace;
  const stable = get(selectedDatum, 'operation.to.stable') || false;

  const onChangeSpaceOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === '' || (value === `${parseInt(value)}` && parseInt(value) < 10)) dispatch({ type: ActionType.SET_SPACE, payload: value === '' ? null : parseInt(value) })
  };

  const onChangeStableOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;

    dispatch({ type: ActionType.SET_STABLE, payload: checked })
  };

  const copyToClipboard = () => {
    if (selectedDatum && selectedDatum.result != null ) {
      copy(selectedDatum.result);

      const copiedElement = document.getElementById('copied')!;

      copiedElement.classList.add('animate');

      copiedElement.onanimationend =() => {
        copiedElement.classList.remove('animate');
      };
    }
  };

  const print = () => {
    if (selectedDatum && selectedDatum.result != null ) {
      let html="<html>";
      html+= selectedDatum.result.replace(/ /g, '\u00a0').replace(/(?:\r\n|\r|\n)/g, '<br>');

      html+="</html>";

      const printWin = window.open('','','left=0,top=0,width=1,height=1,toolbar=0,scrollbars=0,status  =0');
      printWin!.document.write(html);
      printWin!.document.close();
      printWin!.focus();
      printWin!.print();
      printWin!.close();
    }
  };

  return (
    <Container disabled={selectedDatum && selectedDatum.result ? false : true}>
      <BoxLeft>
        <Option>
          <PreLabel>Spaces</PreLabel>
          <SpaceInput maxLength={2} onChange={onChangeSpaceOption} value={space} />
        </Option>
        <Option>
          <PreLabel>Stable</PreLabel>
          <StableInput><input type='checkbox' checked={stable} onChange={onChangeStableOption} /></StableInput>
        </Option>
      </BoxLeft>
      <BoxRight>
        <Copied id='copied'>Copied</Copied>
        <ButtonGroup>
          <StyledButton title='Copy to clipboard' onClick={copyToClipboard}>
            <FontAwesomeIcon icon={faCopy} />
          </StyledButton>
          <StyledButton title='Print' onClick={print}>
            <FontAwesomeIcon icon={faPrint} />
          </StyledButton>
        </ButtonGroup>
      </BoxRight>
    </Container>
  );
}
