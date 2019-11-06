import * as React from 'react';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';
import { Button, ButtonGroup } from 'yuai-buttons';
import { faCopy, faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ItemsContext, ActionType } from '@src/app/contexts/ItemsContext';
import { operate, OperatePayload } from '@src/app/services/itemsService';

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
  const { state, dispatch } = React.useContext(ItemsContext);
  const selectedItem = state.selectedId && state.items[state.selectedId];
  const rawSpace = selectedItem && selectedItem.outputSpace;
  const space = rawSpace == null ? '' : rawSpace;
  const stable = selectedItem && selectedItem.outputStable ? selectedItem.outputStable : false;
  let payload: OperatePayload | undefined;

  if (selectedItem && selectedItem.output) {
    payload = {
      outputSpace: selectedItem.outputSpace!,
      outputStable: selectedItem.outputStable!,
      outputFormat: selectedItem.outputFormat!,
      operator: selectedItem.operator!,
      input:  selectedItem.input!,
      inputFormat: selectedItem.inputFormat!
    };
  }

  const runOperation = async (payload: OperatePayload) => {
    const res = await operate(payload);

    if (res.ok) {
      dispatch({ type: ActionType.PATCH_ITEM, payload: res.data });
    } else {
      dispatch({ type: ActionType.PATCH_ITEM, payload: { errorMessage: res.data.message, output: null } })
    }
  };

  const onChangeSpaceOption = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    dispatch({
      type: ActionType.PATCH_ITEM,
      payload: {
        outputSpace: value === '' ? null : parseInt(value)
      }
    });

    if (payload && (value !== '' || (value === `${parseInt(value)}` && parseInt(value) < 10))) {
      payload.outputSpace = parseInt(value);

      runOperation(payload);
    }
  };

  const onChangeStableOption = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;

    dispatch({
      type: ActionType.PATCH_ITEM,
      payload: {
        outputStable: checked
      }
    });

    if (payload) {
      payload.outputStable = checked;

      runOperation(payload);
    }
  };

  const copyToClipboard = () => {
    if (selectedItem && selectedItem.output != null ) {
      copy(selectedItem.output);

      const copiedElement = document.getElementById('copied')!;

      copiedElement.classList.add('animate');

      copiedElement.onanimationend =() => {
        copiedElement.classList.remove('animate');
      };
    }
  };

  const print = () => {
    if (selectedItem && selectedItem.output != null ) {
      let html="<html>";
      html+= selectedItem.output.replace(/ /g, '\u00a0').replace(/(?:\r\n|\r|\n)/g, '<br>');

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
    <Container disabled={selectedItem && selectedItem.output ? false : true}>
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
