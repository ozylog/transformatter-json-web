import * as React from 'react';
import styled from 'styled-components';
import Button from 'yuai-buttons/dist/Button';
import dayjs from 'dayjs';
import { ItemsContext, ItemsActionType } from '@src/app/contexts/ItemsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faFileAlt, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  height: 100%;
  border-right: 1px solid ${({ theme }) => theme.borderColor};
  width: ${({ theme }) => theme.sidebarWidth};
`;
const Logo = styled.div`
  font-family: 'Passion One';
  padding: 20px 15px;
  text-transform: uppercase;
  height: 60px;
  font-size: 30px;
  text-align: center;
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
  font-size: 23px;
  letter-spacing: 1px;
  margin-top: 2px;
`;
const AddItem = styled.div`
  width: 60%;
  text-align: right;
`;
const AddItemLink = styled(Button)`
  background: none;
  border: 1px solid ${({ theme }) => theme.borderColor};
  color: inherit;
  padding: 5px 11px;
  font-size: 11px;

  &:hover {
    background: ${({ theme }) => theme.activeColor};
  }
`;
const DataContainer = styled.div`
  height: calc(100% - 300px);
  overflow-y: auto;
`;
const DataBox = styled.div`
  font-size: 95%;
  padding: 15px;
  border-radius: 3px;
  cursor: pointer;
  border-top: 1px solid ${({ theme }) => theme.activeColor};
  animation: appear 0.6s linear;

  &:hover {
    .deleteIcon {
      opacity: 1;
    }
  }

  &.selected {
    color: ${({ theme }) => theme.primaryColor};
    background: ${({ theme }) => theme.activeColor};
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
  border-top: 1px solid ${({ theme }) => theme.activeColor};
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 10px 15px;
`;
const FooterLinks = styled.div`
  margin-top: 5px;
  font-size: 80%;
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
const InputItem = styled.input`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primaryColor};
  padding: 0;
  margin: 0;

  &:focus {
    outline: none;
  }
`;

export default function Sidebar() {
  const [ editingRow, setEditingRow ] = React.useState<string | null>(null);
  const Items = React.useContext(ItemsContext);
  const sortedData = Object.values(Items.state.items).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const enableDeletion = sortedData.length > 1;
  const createNew = () => Items.dispatch({ type: ItemsActionType.CREATE_ITEM });
  const selectId = (id: string) => {
    return () => Items.dispatch({ type: ItemsActionType.SET_SELECTED_ID, payload: id });
  };
  const deleteId = (id: string) => {
    return () => Items.dispatch({ type: ItemsActionType.DELETE_ITEM, payload: id });
  };
  const onChangeItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    Items.dispatch({
      type: ItemsActionType.PATCH_ITEM,
      payload: {
        name: value
      }
    });
  };
  const onKeyDownItem = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.keyCode === 13){
      e.currentTarget.blur();
    }
  };

  return (
    <Container>
      <Logo><Yellow>JSON</Yellow> Transformatter</Logo>
      <Header>
        <Links>Links</Links>
        <AddItem>
          <AddItemLink onClick={createNew}><FontAwesomeIcon icon={faPlus} /> Add New</AddItemLink>
        </AddItem>
      </Header>
      <DataContainer>
        {sortedData.map((datum) => {
          const selected = datum.id === Items.state.selectedId;

          return (
            <DataBox className={selected ? 'selected' : ''} key={datum.id} onClick={selectId(datum.id)}>
              <Icon icon={datum.input || datum.output ? faFileAlt : faFile} />
              {
                editingRow === datum.id ?
                  <InputItem onChange={onChangeItem} onKeyDown={onKeyDownItem} onBlur={() => setEditingRow(null)} type='text' value={datum.name} autoFocus /> :
                  <span onDoubleClick={() => setEditingRow(datum.id)}>{datum.name}</span>
              }
              {enableDeletion ? <span onClick={deleteId(datum.id)}><DeleteIcon className='deleteIcon' icon={faTimes} /></span> : <React.Fragment />}
            </DataBox>
          );
        })}
      </DataContainer>
      <Footer>
        <span title={process.env.VERSION}>&copy;</span> 2019-{dayjs().format('YY')} transformatter
        <FooterLinks>
          <a target='_blank' rel='noopener noreferrer' href='https://github.com/transformatter/transformatter-json-services/issues'>Report a bug</a>
        </FooterLinks>
      </Footer>
    </Container>
  );
}
