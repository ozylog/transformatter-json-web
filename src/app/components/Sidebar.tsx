import * as React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { ItemsContext, ActionType } from '@src/app/contexts/ItemsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  height: 100%;
  border-right: 1px solid ${({ theme }) => theme.borderColor};
  width: 250px;
`;
const Logo = styled.div`
  font-family: 'Passion One';
  padding: 20px 15px;
  text-transform: uppercase;
  height: 60px;
  font-size: 24px;
`;
const Yellow = styled.span`
  color: ${({ theme }) => theme.primaryColor};
`;
const Header = styled.div`
  margin: 15px;
  display: flex;
`;
const Links = styled.div`
  width: 40%;
  font-family: 'Passion One';
  text-transform: uppercase;
  font-size: 21px;
  letter-spacing: 1px;
`;
const AddItem = styled.div`
  width: 60%;
  text-align: right;
`;
const AddItemLink = styled.div`
  color: inherit;
  padding: 3px 7px;
  cursor: pointer;
`;
const DataContainer = styled.div`
  height: calc(100% - 300px);
  overflow-y: auto;
`;
const DataBox = styled.div`
  font-size: 90%;
  margin: 0 15px 10px 15px;
  padding: 10px 15px;
  border-radius: 3px;
  cursor: pointer;
  background: ${({ theme }) => theme.activeColor};
  animation: appear 0.6s linear;

  &:hover {
    .deleteIcon {
      opacity: 1;
    }
  }

  &.selected {
    color: ${({ theme }) => theme.primaryColor};
  }

  @keyframes appear {
    0% {
      opacity: 0;
      height: 0;
      padding: 0 15px;
    }
    100% {
      opacity: 1;
      height: 38px;
      padding: 10px 15px;
    }
  }
`;
const Footer = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 10px 15px;
  color: ${({ theme }) => theme.borderColor};
`;
const Icon = styled(FontAwesomeIcon)`
  margin-right: 10px;
  font-size: 120%;
`;
const DeleteIcon = styled(FontAwesomeIcon)`
  float: right;
  margin-top: 3px;
  opacity: 0;

  &:hover {
    color: #de6f76;
  }
`;

export default function Sidebar() {
  const { state, dispatch } = React.useContext(ItemsContext);
  const sortedData = Object.values(state.items).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const enableDeletion = sortedData.length > 1;

  const createNew = () => dispatch({ type: ActionType.CREATE_ITEM });
  const selectId = (id: string) => {
    return () => dispatch({ type: ActionType.SET_SELECTED_ID, payload: id });
  }

  const deleteId = (id: string) => {
    return () => dispatch({ type: ActionType.DELETE_ITEM, payload: id });
  };

  return (
    <Container>
      <Logo><Yellow>JSON</Yellow> Transformatter</Logo>
      <Header>
        <Links>Links</Links>
        <AddItem>
          <AddItemLink onClick={createNew}><FontAwesomeIcon icon={faPlus} /> New Link</AddItemLink>
        </AddItem>
      </Header>
      <DataContainer>
        {sortedData.map((datum) => {
          const selected = datum.id === state.selectedId;

          return (
            <DataBox className={selected ? 'selected' : ''} key={datum.id} onClick={selectId(datum.id)}>
              <Icon icon={faFile} />
              {datum.name}
              {enableDeletion ? <span onClick={deleteId(datum.id)}><DeleteIcon className='deleteIcon' icon={faTimes} /></span> : <React.Fragment />}
            </DataBox>
          )
        })}
      </DataContainer>
      <Footer><span title={process.env.VERSION}>&copy;</span> {dayjs().format('YYYY')} transformatter</Footer>
    </Container>
  );
}
