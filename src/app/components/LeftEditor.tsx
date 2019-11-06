import * as React from 'react';
import styled from 'styled-components';
import Editor from '@src/app/components/Editor';
import { ItemsContext, ItemsActionType, Format } from '@src/app/contexts/ItemsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  width: 50%;
  height: 100%;
  position: relative;
`;
const ErrorContainer = styled.div`
  position: absolute;
  bottom: 15px;
  left: 55px;
  width: calc(100% - 70px);
  padding: 10px;
  border-radius: 3px;
  background: ${({ theme }) => theme.errorBackground};
`;

export default function LeftEditor() {
  const { state, dispatch } = React.useContext(ItemsContext);
  const selectedItem = state.selectedId && state.items[state.selectedId];
  const onChange = (value: string) => {
    dispatch({
      type: ItemsActionType.PATCH_ITEM,
      payload: {
        input: value,
        inputFormat: Format.JSON,
        errorMessage: null
      }
    });
  }

  const input = selectedItem && selectedItem.input ? selectedItem.input : '';
  const errorMessage = selectedItem && selectedItem.errorMessage ? selectedItem.errorMessage : '';

  const ErrorMessage: React.SFC<{ value: string }> = ({ value }) => (
    <ErrorContainer>
      <FontAwesomeIcon icon={faExclamation} /> {value}
    </ErrorContainer>
  );

  return (
    <Container>
      <Editor name='LeftEditor' value={input} onChange={onChange} />
      {errorMessage ? <ErrorMessage value={errorMessage}  /> : <React.Fragment />}
    </Container>
  );
}
