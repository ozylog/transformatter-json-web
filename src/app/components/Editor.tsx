import * as React from 'react';
import AceEditor from 'react-ace';
import { IAceEditorProps } from 'react-ace/lib/ace'
import 'brace/mode/json';
import 'brace/theme/monokai';

interface Props {
  name: string;
  value?: string | null;
  readOnly?: boolean;
  onChange?: IAceEditorProps['onChange'];
}

export default function Editor({ name, value, readOnly, onChange }: React.PropsWithChildren<Props>) {
  return (
    <AceEditor
      name={name}
      mode='json'
      theme='monokai'
      tabSize={2}
      height='100%'
      width='100%'
      readOnly={readOnly}
      showPrintMargin={false}
      setOptions={{ fontFamily: 'Roboto Mono'}}
      onLoad={function (_editor) {
        _editor.$blockScrolling = 1
      }}
      onChange={onChange}
      value={value || ''}
    />
  );
}

Editor.defaultProps = {
  readOnly: false
}
