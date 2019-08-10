import * as React from 'react';
import styled from 'styled-components';
import LeftPanel from '@src/app/components/LeftPanel';
import LeftEditor from '@src/app/components/LeftEditor';
import RightEditor from '@src/app/components/RightEditor';
import RightPanel from './RightPanel';

const Container = styled.div`
  width: calc(100% - 250px);
`;
const PanelContainer = styled.div`
  height: 60px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;
`;
const EditorContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100% - 60px);
`;

export default function Content() {
  return (
    <Container>
      <PanelContainer>
        <LeftPanel />
        <RightPanel />
      </PanelContainer>
      <EditorContainer>
        <LeftEditor />
        <RightEditor />
      </EditorContainer>
    </Container>
  )
}

