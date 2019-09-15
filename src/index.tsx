import App from '@src/app/containers/App';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import * as React from 'react';
import { render } from 'react-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { ItemsProvider } from '@src/app/contexts/ItemsContext';

const env = process.env.NODE_ENV;

if (env && [ 'production', 'staging' ].includes(env)) OfflinePluginRuntime.install();

const GlobalStyle = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    box-sizing: border-box;
    overflow-x: hidden;
    margin: 0;
    padding: 0;
    background: repeating-linear-gradient(
      45deg,
      #333,
      #333 10px,
      #666 10px,
      #666 20px
    );
  }
`;
const theme = {
  primaryColor: '#f4cb42',
  textColor: '#e5e5e5',
  borderColor: '#555',
  activeColor: '#191919',
  inputColor: '#272822;',
  errorBackground: '#8a1e1e',
  maxWidth: '3000px'
};

render(
  <ThemeProvider theme={theme}>
    <React.Fragment>
      <GlobalStyle />
      <ItemsProvider>
        <App/>
      </ItemsProvider>
    </React.Fragment>
  </ThemeProvider>
  , document.getElementById('app'));
