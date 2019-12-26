import * as React from 'react';
import styled from 'styled-components';
import Button from 'yuai-buttons/dist/Button';
import { AppContext, AppActionType } from '@src/app/contexts/AppContext';
import { ItemsContext, ItemsActionType, Operator, Format } from '@src/app/contexts/ItemsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { operate } from '@src/app/services/itemsService';

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
  const Items = React.useContext(ItemsContext);
  const App = React.useContext(AppContext);
  const selectedItem = Items.state.selectedId && Items.state.items[Items.state.selectedId];

  const run = async (operator: Operator, outputFormat: Format) => {
    if (!selectedItem || !selectedItem.input || !selectedItem.inputFormat) return;

    const payload = {
      outputSpace: selectedItem.outputSpace || 2,
      outputStable: selectedItem.outputStable || false,
      outputFormat,
      operator: operator,
      input:  selectedItem.input,
      inputFormat: selectedItem.inputFormat
    };

    App.dispatch({ type: AppActionType.EDITOR_LOADING, payload: true });

    const res = await operate(payload);

    App.dispatch({ type: AppActionType.EDITOR_LOADING, payload: false });

    if (res.ok) {
      Items.dispatch({ type: ItemsActionType.PATCH_ITEM, payload: { ...payload, ...res.data } });
    } else {
      Items.dispatch({ type: ItemsActionType.PATCH_ITEM, payload: { errorMessage: res.data.message, output: null } })
    }
  };

  const beautify = () => run(Operator.BEAUTIFY_JSON, Format.JSON);
  const convertToXML = () => run(Operator.CONVERT_JSON_TO_XML, Format.XML);

  return (
    <Container disabled={selectedItem && selectedItem.input ? false : true}>
      <StyledButton onClick={beautify}><FontAwesomeIcon icon={faPlay} /> Beautify</StyledButton>
      <StyledButton onClick={convertToXML}><FontAwesomeIcon icon={faPlay} /> Convert to XML</StyledButton>
    </Container>
  );
}
