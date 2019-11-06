import * as React from 'react';
import styled from 'styled-components';
import Content from '@src/app/components/Content';
import Sidebar from '@src/app/components/Sidebar';
import { ItemsContext, ItemsActionType } from '@src/app/contexts/ItemsContext';

const Layout = styled.div`
  font-family: 'Roboto Mono';
  color: ${({ theme }) => theme.textColor};
  font-size: 14px;
  background: #222;
  display: flex;
  max-width: ${({ theme }) => theme.maxWidth};
  min-width: 1200px;
  margin: auto;
`;

export default function App() {
  const { state, dispatch } = React.useContext(ItemsContext);
  const [ height, setHeight ] = React.useState(window.innerHeight);
  const updateHeight = () => setHeight(window.innerHeight);

  if (!state.selectedId) dispatch({ type: ItemsActionType.CREATE_ITEM });

  React.useEffect(() => {
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <Layout style={{ height: `${height}px` }}>
      <Sidebar />
      <Content />
    </Layout>
  );
}

