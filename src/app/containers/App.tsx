import * as React from 'react';
import styled from 'styled-components';
import Content from '@src/app/components/Content';
import Sidebar from '@src/app/components/Sidebar';
import { DataContext, ActionType } from '@src/app/contexts/DataContext';

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
  const { state, dispatch } = React.useContext(DataContext);
  const [ height, setHeight ] = React.useState(window.innerHeight);
  const items = window.location.pathname.split('/');
  const id = items[1];
  const updateHeight = () => {
    setHeight(window.innerHeight);
  };

  if (id) {
    if (state.data[id]) {
      if (state.selectedId !== id) {
        window.history.replaceState('', '', `/${state.selectedId}`);
      }
    } else {
      if (state.selectedId) {
        window.history.replaceState('', '', `/${state.selectedId}`);
      } else{
        dispatch({ type: ActionType.CREATE_DATA });
      }
    }
  } else {
    if (state.selectedId) {
      window.history.replaceState('', '', `/${state.selectedId}`);
    } else {
      dispatch({ type: ActionType.CREATE_DATA });
    }
  }

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

