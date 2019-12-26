import * as React from 'react';
import styled from 'styled-components';
import LeftPanel from '@src/app/components/LeftPanel';
import LeftEditor from '@src/app/components/LeftEditor';
import RightEditor from '@src/app/components/RightEditor';
import RightPanel from '@src/app/components/RightPanel';
import { AppContext } from '@src/app/contexts/AppContext';

const Container = styled.div`
  width: calc(100% - ${({ theme }) => theme.sidebarWidth});
`;
const PanelContainer = styled.div`
  height: 60px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;
`;
const EditorContainer = styled.div`
  position: relative;
  height: calc(100% - 60px);
`;
const Editors = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;

  ${({ loading }: { loading: boolean }) => loading && `
    filter: blur(8px);
    -webkit-filter: blur(8px);
  `}
`;
const EditorLoader = styled.div`
  display: none;
  width: 64px;
  height: 64px;
  position: absolute;
  top: calc(50% - 32px);
  left: calc(50% - 32px);
  z-index: 4;

  ${({ loading }: { loading: boolean }) => loading && `
    display: inline-block;
  `}

  &:after {
    content: " ";
    display: block;
    width: 46px;
    height: 46px;
    margin: 1px;
    border-radius: 50%;
    border: 5px solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default function Content() {
  const App = React.useContext(AppContext);

  return (
    <Container>
      <PanelContainer>
        <LeftPanel />
        <RightPanel />
      </PanelContainer>
      <EditorContainer>
        <Editors loading={App.state.isEditorLoading}>
          <LeftEditor />
          <RightEditor />
        </Editors>
        <EditorLoader loading={App.state.isEditorLoading} />
      </EditorContainer>
    </Container>
  );
}

